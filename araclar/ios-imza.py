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
    cert = call("POST", "/certificates", {"data": {"type": "certificates", "attributes": {"certificateType": "DISTRIBUTION", "csrContent": csr}}})["data"]
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


if __name__ == "__main__":
    {"hazirla": hazirla, "temizle": temizle}[sys.argv[1]](sys.argv[2])
