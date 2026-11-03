#!/usr/bin/env python3
"""TestFlight derlemesi için geçici App Store imzası (GitHub Actions'ta çalışır).

  hazirla <klasör>  : yeni anahtar + CSR → Apple Distribution sertifikası, App Store profili
  temizle <klasör>  : bu çalışmada oluşturulan sertifikayı ve profili siler

Ortam: ASC_KEY_ID, ASC_ISSUER_ID, KEY_PATH (.p8), BUNDLE (com.ugurbektas.hafif)
Gerekli paketler: pyjwt, cryptography, requests
Sertifika her çalışmada yeniden oluşturulup sonunda silinir: Apple'ın dağıtım sertifikası sınırına
takılmaz; TestFlight'a yüklenmiş derlemeler sertifika silinince etkilenmez.
"""
import base64, json, os, subprocess, sys, time
import jwt, requests

API = "https://api.appstoreconnect.apple.com/v1"


def token():
    key = open(os.environ["KEY_PATH"]).read()
    now = int(time.time())
    return jwt.encode({"iss": os.environ["ASC_ISSUER_ID"], "iat": now, "exp": now + 1100, "aud": "appstoreconnect-v1"},
                      key, algorithm="ES256", headers={"kid": os.environ["ASC_KEY_ID"], "typ": "JWT"})


def call(method, path, body=None, ok=(200, 201, 204)):
    r = requests.request(method, API + path, json=body, headers={"Authorization": "Bearer " + token()}, timeout=60)
    if r.status_code not in ok:
        try:
            errs = r.json().get("errors", [])
            msg = " | ".join(f"{e.get('title')}: {e.get('detail')}" for e in errs)
        except Exception:
            msg = r.text[:500]
        print(f"::error::App Store Connect API {method} {path} → {r.status_code}: {msg}")
        sys.exit(1)
    return r.json() if r.content else {}


def hazirla(out):
    os.makedirs(out, exist_ok=True)
    bundle = os.environ.get("BUNDLE", "com.ugurbektas.hafif")
    b = call("GET", f"/bundleIds?filter[identifier]={bundle}&limit=5")["data"]
    b = [x for x in b if x["attributes"]["identifier"] == bundle]
    if not b:
        print(f"::error::{bundle} için App ID yok. developer.apple.com → Identifiers'ta oluştur (HealthKit işaretli).")
        sys.exit(1)
    bid = b[0]["id"]
    caps = call("GET", f"/bundleIds/{bid}/bundleIdCapabilities")["data"]
    print("App ID yetenekleri:", ", ".join(c["attributes"]["capabilityType"] for c in caps) or "-")
    if not any(c["attributes"]["capabilityType"] == "HEALTHKIT" for c in caps):
        print("HealthKit açık değil, açılıyor…")
        call("POST", "/bundleIdCapabilities", {"data": {"type": "bundleIdCapabilities", "attributes": {"capabilityType": "HEALTHKIT"},
                                                         "relationships": {"bundleId": {"data": {"type": "bundleIds", "id": bid}}}}})

    k, c = os.path.join(out, "key.pem"), os.path.join(out, "csr.pem")
    subprocess.run(["openssl", "genrsa", "-out", k, "2048"], check=True, capture_output=True)
    subprocess.run(["openssl", "req", "-new", "-key", k, "-out", c, "-subj", "/CN=Hafif CI/emailAddress=apphafif@gmail.com"], check=True)
    csr = open(c).read()
    body = "".join(l for l in csr.splitlines() if "-----" not in l)
    var = call("GET", "/certificates?limit=50")["data"]
    print("Hesaptaki sertifikalar:", ", ".join(f"{x['attributes']['certificateType']} ({x['attributes'].get('expirationDate','')[:10]})" for x in var) or "yok")
    cert = None
    # Apple ara sıra 500 dönüyor; tür ve CSR biçimi değiştirilerek, kısa beklemelerle denenir
    for tur, icerik in [("DISTRIBUTION", csr), ("DISTRIBUTION", body), ("IOS_DISTRIBUTION", csr), ("IOS_DISTRIBUTION", body), ("DISTRIBUTION", csr)]:
        r = requests.post(API + "/certificates", json={"data": {"type": "certificates", "attributes": {"certificateType": tur, "csrContent": icerik}}},
                          headers={"Authorization": "Bearer " + token()}, timeout=60)
        print(f"Sertifika denemesi {tur} · {'PEM' if icerik is csr else 'gövde'} → {r.status_code}", (r.text[:300] if r.status_code >= 300 else ""))
        if r.status_code == 201:
            cert = r.json()["data"]; break
        time.sleep(8)
    if not cert:
        print("::error::Apple dağıtım sertifikası oluşturulamadı (yukarıdaki yanıtlar)"); sys.exit(1)
    open(os.path.join(out, "cert.cer"), "wb").write(base64.b64decode(cert["attributes"]["certificateContent"]))
    print("Sertifika oluşturuldu:", cert["attributes"].get("name"), cert["id"])

    name = f"Hafif CI {time.strftime('%Y%m%d-%H%M%S')}"
    prof = call("POST", "/profiles", {"data": {"type": "profiles", "attributes": {"name": name, "profileType": "IOS_APP_STORE"},
                                               "relationships": {"bundleId": {"data": {"type": "bundleIds", "id": bid}},
                                                                 "certificates": {"data": [{"type": "certificates", "id": cert["id"]}]}}}})["data"]
    open(os.path.join(out, "profile.mobileprovision"), "wb").write(base64.b64decode(prof["attributes"]["profileContent"]))
    print("Profil oluşturuldu:", name, prof["attributes"].get("uuid"))
    json.dump({"cert": cert["id"], "profile": prof["id"], "name": name, "uuid": prof["attributes"].get("uuid")}, open(os.path.join(out, "ids.json"), "w"))


def temizle(out):
    try:
        ids = json.load(open(os.path.join(out, "ids.json")))
    except FileNotFoundError:
        print("Silinecek bir şey yok"); return
    call("DELETE", f"/profiles/{ids['profile']}", ok=(204, 404))
    call("DELETE", f"/certificates/{ids['cert']}", ok=(204, 404))
    print("Geçici sertifika ve profil silindi")


def durum(out):
    """Uygulamanın TestFlight derlemelerini ve test gruplarını listeler (ios-durum iş akışı)."""
    bundle = os.environ.get("BUNDLE", "com.ugurbektas.hafif")
    apps = call("GET", f"/apps?filter[bundleId]={bundle}")["data"]
    if not apps:
        print("Uygulama kaydı bulunamadı"); return
    aid = apps[0]["id"]
    satir = [f"Uygulama: {apps[0]['attributes']['name']} ({aid})"]
    builds = call("GET", f"/builds?filter[app]={aid}&sort=-uploadedDate&limit=10&include=preReleaseVersion,buildBetaDetail")
    inc = {(x["type"], x["id"]): x for x in builds.get("included", [])}
    for b in builds["data"]:
        a = b["attributes"]
        pv = inc.get(("preReleaseVersions", (b["relationships"].get("preReleaseVersion", {}).get("data") or {}).get("id")), {})
        bd = inc.get(("buildBetaDetails", (b["relationships"].get("buildBetaDetail", {}).get("data") or {}).get("id")), {})
        satir.append(f"Derleme {pv.get('attributes', {}).get('version', '?')} ({a.get('version')}) · işlenme: {a.get('processingState')}"
                     f" · süresi doldu: {a.get('expired')} · yüklendi: {a.get('uploadedDate', '')[:16]}"
                     f" · iç test: {bd.get('attributes', {}).get('internalBuildState', '-')}"
                     f" · şifreleme sorusu: {'cevaplanmalı' if a.get('usesNonExemptEncryption') is None else a.get('usesNonExemptEncryption')}")
    gr = call("GET", f"/betaGroups?filter[app]={aid}&limit=20")["data"]
    satir.append("Test grupları: " + (", ".join(f"{g['attributes']['name']} ({'iç' if g['attributes'].get('isInternalGroup') else 'dış'})" for g in gr) or "yok"))
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, "durum.txt"), "w").write("\n".join(satir) + "\n")
    print("\n".join(satir))


if __name__ == "__main__":
    {"hazirla": hazirla, "temizle": temizle, "durum": durum}[sys.argv[1]](sys.argv[2])
