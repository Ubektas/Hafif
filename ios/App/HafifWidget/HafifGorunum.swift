import SwiftUI
import WidgetKit

// MARK: - boy, renk, yazı

/// Widget'ın çizildiği boy. Widget'ta WidgetFamily'den gelir; boyut kontrolünde doğrudan verilir.
enum Boy: String, CaseIterable { case kucuk, orta, buyuk, kilitDik, kilitYuvarlak, kilitSatir }

@available(iOS 16.0, *)
extension Boy {
    init(_ f: WidgetFamily) {
        switch f {
        case .systemMedium: self = .orta
        case .systemLarge: self = .buyuk
        case .accessoryRectangular: self = .kilitDik
        case .accessoryCircular: self = .kilitYuvarlak
        case .accessoryInline: self = .kilitSatir
        default: self = .kucuk
        }
    }
}

/// Android widget'larıyla aynı renkler.
struct Pal {
    let koyu: Bool
    private func r(_ a: UInt32, _ b: UInt32) -> Color { let h = koyu ? b : a; return Color(red: Double((h >> 16) & 255) / 255, green: Double((h >> 8) & 255) / 255, blue: Double(h & 255) / 255) }
    var bg: Color { r(0xFBFAF7, 0x13251F) }
    var fg: Color { r(0x0B2420, 0xE6F2ED) }
    var mu: Color { r(0x62756F, 0x93ABA4) }
    var wl: Color { r(0xEEF2F0, 0x1A2F2A) }
    var trk: Color { r(0xE9EEEB, 0x203832) }
    var pro: Color { r(0xC27A12, 0xE3A24A) }
    var proS: Color { r(0xFBEFD9, 0x3A2A12) }
    var su: Color { r(0x2E8BC0, 0x5AAEDE) }
    var suS: Color { r(0xE2F0F8, 0x12304A) }
    var ad: Color { r(0x1C8EA6, 0x4CBFD3) }
    var ig: Color { r(0x33509A, 0x8EA6EA) }
    var igS: Color { r(0xE6EBF6, 0x1E2847) }
    var ki: Color { r(0x0E7C66, 0x4FD1A8) }
    var on: Color { r(0xFFFFFF, 0x0B1C19) }
    var kiS: Color { r(0xE1F3EC, 0x103A30) }
    var tk: Color { r(0xB8577A, 0xE28BAE) }
    var tkS: Color { r(0xF7E8EE, 0x3A1C28) }
    static let mint = Color(red: 0x9F / 255, green: 0xF0 / 255, blue: 0xD6 / 255)
    static let kiloArka = LinearGradient(colors: [Color(red: 0x0F / 255, green: 0x4C / 255, blue: 0x41 / 255), Color(red: 0x07 / 255, green: 0x24 / 255, blue: 0x20 / 255)], startPoint: .topLeading, endPoint: .bottomTrailing)
}

enum Yazi {
    static func outfit(_ s: CGFloat) -> Font { .custom("Outfit-Bold", fixedSize: s) }
    static func bold(_ s: CGFloat) -> Font { .custom("Figtree-Bold", fixedSize: s) }
    static func orta(_ s: CGFloat) -> Font { .custom("Figtree-Medium", fixedSize: s) }
}

enum Bicim {
    static let tr = Locale(identifier: "tr_TR")
    static func sayi(_ x: Double, _ k: Int = 0) -> String {
        let f = NumberFormatter(); f.locale = tr; f.numberStyle = .decimal; f.minimumFractionDigits = k; f.maximumFractionDigits = k
        return f.string(from: NSNumber(value: x)) ?? "\(x)"
    }
    static func litre(_ ml: Double) -> String {
        let f = NumberFormatter(); f.locale = tr; f.numberStyle = .decimal; f.maximumFractionDigits = 2; f.minimumFractionDigits = 0
        return f.string(from: NSNumber(value: ml / 1000)) ?? ""
    }
    static func kg(_ x: Double) -> String { sayi(x, 1) }
    static func isaretli(_ x: Double) -> String { (x < 0 ? "−" : "+") + sayi(abs(x), 1) }
    static func doz(_ d: String?) -> String? {
        guard let d = d?.trimmingCharacters(in: .whitespaces), !d.isEmpty else { return nil }
        return d.lowercased().contains("mg") ? d : d + " mg"
    }
    static func gunAdi(_ d: Date) -> String { let f = DateFormatter(); f.locale = tr; f.dateFormat = "EEEE"; return f.string(from: d).capitalized(with: tr) }
    static func saat(_ d: Date) -> String { let f = DateFormatter(); f.locale = tr; f.dateFormat = "HH:mm"; return f.string(from: d) }
    static func tarih(_ d: Date) -> String { let f = DateFormatter(); f.locale = tr; f.dateFormat = "EEEE d MMMM"; return f.string(from: d).capitalized(with: tr) }
    static func ay(_ d: Date, _ simdi: Date) -> String {
        let f = DateFormatter(); f.locale = tr
        f.dateFormat = Calendar.current.component(.year, from: d) == Calendar.current.component(.year, from: simdi) ? "LLLL" : "LLLL yyyy"
        return f.string(from: d).capitalized(with: tr)
    }
    /// bugünden kaç gün sonra (takvim günü)
    static func gunFarki(_ d: Date, _ simdi: Date) -> Int {
        let c = Calendar.current
        return c.dateComponents([.day], from: c.startOfDay(for: simdi), to: c.startOfDay(for: d)).day ?? 0
    }
}

// MARK: - boyut kontrolü (yalnızca simülatör testinde açık)

/// Her yazı ve düğme kutusunu kaydeder; test bunların üst üste binip binmediğine ve widget'tan taşıp taşmadığına bakar.
final class OlcKayit {
    static var acik = false
    static var kutular: [String: CGRect] = [:]
    static func ekle(_ id: String, _ r: CGRect) { kutular[id] = r }
}

@available(iOS 16.0, *)
extension View {
    func olc(_ id: String) -> some View {
        background(GeometryReader { g -> Color in
            if OlcKayit.acik { OlcKayit.ekle(id, g.frame(in: .named("w"))) }
            return Color.clear
        })
    }
    func tek() -> some View { lineLimit(1).minimumScaleFactor(0.6) }
}

// MARK: - parçalar

@available(iOS 16.0, *)
struct Halka: View {
    let v: Double; let renk: Color; let iz: Color; let kalin: CGFloat
    var body: some View {
        ZStack {
            Circle().stroke(iz, lineWidth: kalin)
            Circle().trim(from: 0, to: max(0.001, min(1, v))).stroke(renk, style: StrokeStyle(lineWidth: kalin, lineCap: .round)).rotationEffect(.degrees(-90))
        }.padding(kalin / 2)
    }
}

@available(iOS 16.0, *)
struct Baslik: View {
    let simge: String; let renk: Color; let yazi: String; let yaziRenk: Color; let u: CGFloat
    var sag: AnyView? = nil
    var body: some View {
        HStack(spacing: 5 * u) {
            Image(systemName: simge).font(.system(size: 11 * u, weight: .semibold)).foregroundColor(renk)
            Text(yazi).font(Yazi.bold(12 * u)).foregroundColor(yaziRenk).tek()
            Spacer(minLength: 4 * u)
            if let sag = sag { sag }
        }.olc("baslik")
    }
}

@available(iOS 16.0, *)
struct Hap: View {
    let yazi: String; let on: Color; let arka: Color; let u: CGFloat
    var body: some View {
        Text(yazi).font(Yazi.bold(11 * u)).foregroundColor(on).tek()
            .padding(.horizontal, 7 * u).padding(.vertical, 4 * u).background(Capsule().fill(arka)).fixedSize()
    }
}

@available(iOS 16.0, *)
struct Bardaklar: View {
    let ml: Double; let hedef: Double; let sutun: Int; let renk: Color; let u: CGFloat
    var body: some View {
        let per = max(1, hedef / 10)
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 4 * u), count: sutun), spacing: 4 * u) {
            ForEach(0..<10, id: \.self) { i in
                let f = max(0, min(1, (ml - Double(i) * per) / per))
                ZStack(alignment: .bottom) {
                    RoundedRectangle(cornerRadius: 3 * u).stroke(renk, lineWidth: 1.5 * u)
                    GeometryReader { g in
                        RoundedRectangle(cornerRadius: 3 * u).fill(renk).frame(height: g.size.height * f).frame(maxHeight: .infinity, alignment: .bottom)
                    }
                }.aspectRatio(0.75, contentMode: .fit)
            }
        }
    }
}

@available(iOS 16.0, *)
struct SuDugme: View {
    let pal: Pal; let u: CGFloat
    var daire: some View {
        Circle().fill(pal.su).frame(width: 40 * u, height: 40 * u)
            .overlay(Image(systemName: "plus").font(.system(size: 18 * u, weight: .bold)).foregroundColor(.white))
    }
    var body: some View {
        Group {
            if #available(iOS 17.0, *) {
                Button(intent: SuEkle()) { daire }.buttonStyle(.plain)
            } else {
                Link(destination: URL(string: "hafif://w/water/250")!) { daire }
            }
        }.olc("suDugme")
    }
}

@available(iOS 16.0, *)
struct Egri: View {
    let pts: [[Double]]; let renk: Color; let dolgu: Bool
    var body: some View {
        GeometryReader { g in
            let p = pts.filter { $0.count >= 2 }
            if p.count >= 2 {
                let xs = p.map { $0[0] }, ys = p.map { $0[1] }
                let x0 = xs.min()!, x1 = max(xs.max()!, x0 + 1), lo = ys.min()!, hi = max(ys.max()!, lo + 0.5)
                let nok = p.map { CGPoint(x: CGFloat(($0[0] - x0) / (x1 - x0)) * g.size.width, y: CGFloat(1 - ($0[1] - lo) / (hi - lo)) * g.size.height * 0.82 + g.size.height * 0.06) }
                ZStack {
                    if dolgu {
                        Path { a in a.move(to: CGPoint(x: nok[0].x, y: g.size.height)); nok.forEach { a.addLine(to: $0) }; a.addLine(to: CGPoint(x: nok.last!.x, y: g.size.height)); a.closeSubpath() }
                            .fill(LinearGradient(colors: [renk.opacity(0.28), renk.opacity(0)], startPoint: .top, endPoint: .bottom))
                    }
                    Path { a in a.move(to: nok[0]); nok.dropFirst().forEach { a.addLine(to: $0) } }
                        .stroke(renk, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                }
            }
        }
    }
}

/// Widget'ın içeriği için ölçek: tasarım küçükte 130, ortada 310 pt genişliğindeki içerik alanına göre yapıldı.
@available(iOS 16.0, *)
struct Olcekli<C: View>: View {
    let boy: Boy
    @ViewBuilder let icerik: (CGFloat) -> C
    var body: some View {
        GeometryReader { g in
            let u = boy == .orta ? min(g.size.width / 310, g.size.height / 130) : min(g.size.width / 130, g.size.height / 130)
            icerik(u).frame(width: g.size.width, height: g.size.height, alignment: .topLeading)
        }.coordinateSpace(name: "w")
    }
}

// MARK: - Bugün

@available(iOS 16.0, *)
struct Satir { let simge: String; let oran: Double; let renk: Color; let deger: String; let ad: String; let kalan: String }

@available(iOS 16.0, *)
struct BugunGorunum: View {
    let v: WVeri?; let an: Date; let boy: Boy; let pal: Pal
    static func satirlar(_ g: WVeri.Gun?, _ pal: Pal) -> [Satir] {
        let d = g ?? WVeri.Gun(w: 0, wg: 2500, p: 0, pg: 100, st: nil, sg: 7500)
        let p = d.p ?? 0, pg = max(1, d.pg ?? 100), w = d.w ?? 0, wg = max(1, d.wg ?? 2500), sg = max(1, d.sg ?? 7500)
        var L: [Satir] = []
        L.append(Satir(simge: "fork.knife", oran: p / pg, renk: pal.pro, deger: "\(Bicim.sayi(p)) g", ad: "protein", kalan: p >= pg ? "tamam ✓" : "\(Bicim.sayi(pg - p)) g kaldı"))
        L.append(Satir(simge: "drop.fill", oran: w / wg, renk: pal.su, deger: "\(Bicim.litre(w)) L", ad: "su", kalan: w >= wg ? "tamam ✓" : "\(Int(ceil((wg - w) / 250))) bardak"))
        if let st = d.st {
            L.append(Satir(simge: "figure.walk", oran: st / sg, renk: pal.ad, deger: Bicim.sayi(st), ad: "adım", kalan: st >= sg ? "tamam ✓" : "\(Bicim.sayi(sg - st)) kaldı"))
        }
        return L
    }
    var body: some View {
        let satirlar = BugunGorunum.satirlar(v?.gun(an), pal)
        switch boy {
        case .kilitDik:
            VStack(alignment: .leading, spacing: 3) {
                ForEach(Array(satirlar.enumerated()), id: \.offset) { i, s in
                    HStack(spacing: 5) {
                        Image(systemName: s.simge).font(.system(size: 10, weight: .semibold)).frame(width: 13)
                        GeometryReader { g in
                            ZStack(alignment: .leading) { Capsule().opacity(0.25); Capsule().frame(width: g.size.width * min(1, max(0.02, s.oran))) }
                        }.frame(height: 5)
                        Text(s.deger).font(Yazi.bold(11)).tek().frame(width: 44, alignment: .trailing)
                    }.olc("satir\(i)")
                }
            }.frame(maxHeight: .infinity)
        case .orta:
            Olcekli(boy: boy) { u in
                VStack(alignment: .leading, spacing: 0) {
                    Baslik(simge: "leaf.fill", renk: pal.ki, yazi: "Bugün", yaziRenk: pal.mu, u: u,
                           sag: AnyView(Text(Bicim.tarih(an)).font(Yazi.orta(11.5 * u)).foregroundColor(pal.mu).tek()))
                    Spacer(minLength: 6 * u)
                    HStack(spacing: 4 * u) {
                        ForEach(Array(satirlar.enumerated()), id: \.offset) { i, s in
                            HStack(spacing: 5 * u) {
                                ZStack {
                                    Halka(v: s.oran, renk: s.renk, iz: pal.trk, kalin: 4.5 * u)
                                    Image(systemName: s.simge).font(.system(size: 11 * u, weight: .semibold)).foregroundColor(s.renk)
                                }.frame(width: 34 * u, height: 34 * u)
                                VStack(alignment: .leading, spacing: 1 * u) {
                                    Text(s.deger).font(Yazi.outfit(14 * u)).foregroundColor(pal.fg).tek()
                                    Text(s.kalan).font(Yazi.orta(10 * u)).foregroundColor(pal.mu).tek()
                                }
                                Spacer(minLength: 0)
                            }.frame(maxWidth: .infinity).olc("halka\(i)")
                        }
                    }
                    Spacer(minLength: 6 * u)
                    HStack(spacing: 8 * u) {
                        Group {
                            if #available(iOS 17.0, *) { Button(intent: SuEkle()) { dugme("+ 250 ml su", pal.su, pal.suS, u) }.buttonStyle(.plain) }
                            else { Link(destination: URL(string: "hafif://w/water/250")!) { dugme("+ 250 ml su", pal.su, pal.suS, u) } }
                        }.olc("dugmeSu")
                        Link(destination: URL(string: "hafif://w/protein")!) { dugme("+ Protein", pal.pro, pal.proS, u) }.olc("dugmeProtein")
                    }
                }
            }
        default:
            Olcekli(boy: boy) { u in
                VStack(alignment: .leading, spacing: 0) {
                    Baslik(simge: "leaf.fill", renk: pal.ki, yazi: "Bugün", yaziRenk: pal.mu, u: u)
                    Spacer(minLength: 6 * u)
                    VStack(alignment: .leading, spacing: 8 * u) {
                        ForEach(Array(satirlar.enumerated()), id: \.offset) { i, s in
                            HStack(spacing: 7 * u) {
                                Halka(v: s.oran, renk: s.renk, iz: pal.trk, kalin: 4 * u).frame(width: 24 * u, height: 24 * u)
                                (Text(s.deger).font(Yazi.outfit(15 * u)).foregroundColor(pal.fg)
                                    + Text("  " + s.ad).font(Yazi.orta(10.5 * u)).foregroundColor(pal.mu)).lineLimit(1).minimumScaleFactor(0.8)
                                Spacer(minLength: 0)
                            }.olc("satir\(i)")
                        }
                    }
                    Spacer(minLength: 0)
                }
            }
        }
    }
    func dugme(_ t: String, _ on: Color, _ arka: Color, _ u: CGFloat) -> some View {
        Text(t).font(Yazi.bold(12 * u)).foregroundColor(on).tek()
            .frame(maxWidth: .infinity).padding(.vertical, 9 * u).background(RoundedRectangle(cornerRadius: 11 * u).fill(arka))
    }
}

// MARK: - Sıradaki iğne

@available(iOS 16.0, *)
struct IgneGorunum: View {
    let v: WVeri?; let an: Date; let boy: Boy; let pal: Pal
    var body: some View {
        let n = v?.next, t = n.map { Date(timeIntervalSince1970: $0.ts / 1000) }
        let fark = t.map { Bicim.gunFarki($0, an) } ?? 0
        let ne = fark <= 0 ? "Bugün" : fark == 1 ? "Yarın" : "\(fark) gün sonra"
        let doz = Bicim.doz(n?.dose)
        switch boy {
        case .kilitSatir:
            if let t = t {
                Label("\(Bicim.gunAdi(t)) \(Bicim.saat(t))\(doz.map { " · " + $0 } ?? "")", systemImage: "syringe")
            } else {
                Label("Sıradaki iğne yok", systemImage: "syringe")
            }
        case .orta:
            Olcekli(boy: boy) { u in
                VStack(alignment: .leading, spacing: 0) {
                    Baslik(simge: "syringe", renk: pal.ig, yazi: "Sıradaki iğne", yaziRenk: pal.mu, u: u,
                           sag: doz.map { AnyView(Hap(yazi: $0, on: pal.ig, arka: pal.igS, u: u)) })
                    if let t = t {
                        Spacer(minLength: 4 * u)
                        Text(fark <= 0 ? "Bugün" : Bicim.gunAdi(t)).font(Yazi.outfit(25 * u)).foregroundColor(pal.fg).tek().olc("gun")
                        Text([Bicim.saat(t), n?.site, fark > 0 ? ne : nil].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " · "))
                            .font(Yazi.orta(11.5 * u)).foregroundColor(pal.mu).tek().olc("alt")
                        Spacer(minLength: 6 * u)
                        HStack(spacing: 4 * u) {
                            ForEach(0..<7, id: \.self) { i in
                                let g = Calendar.current.date(byAdding: .day, value: i, to: an)!
                                let ig = i == fark, bugun = i == 0
                                Text(harf(g)).font(Yazi.bold(11 * u)).foregroundColor(ig ? pal.on : bugun ? pal.ig : pal.mu).tek()
                                    .frame(maxWidth: .infinity).padding(.vertical, 6 * u)
                                    .background(RoundedRectangle(cornerRadius: 8 * u).fill(ig ? pal.ig : bugun ? pal.igS : pal.wl))
                            }
                        }.olc("gunler")
                    } else { bos(u) }
                }
            }
        default:
            Olcekli(boy: boy) { u in
                VStack(alignment: .leading, spacing: 0) {
                    Baslik(simge: "syringe", renk: pal.ig, yazi: "İğne", yaziRenk: pal.mu, u: u,
                           sag: doz.map { AnyView(Hap(yazi: $0, on: pal.ig, arka: pal.igS, u: u)) })
                    if let t = t {
                        Spacer(minLength: 4 * u)
                        HStack(alignment: .firstTextBaseline, spacing: 5 * u) {
                            if fark > 1 {
                                Text("\(fark)").font(Yazi.outfit(36 * u)).foregroundColor(pal.ig)
                                Text("gün sonra").font(Yazi.bold(12.5 * u)).foregroundColor(pal.mu)
                            } else {
                                Text(ne).font(Yazi.outfit(30 * u)).foregroundColor(pal.ig)
                            }
                        }.tek().olc("sayac")
                        Spacer(minLength: 4 * u)
                        Text("\(Bicim.gunAdi(t)) \(Bicim.saat(t))").font(Yazi.bold(12 * u)).foregroundColor(pal.fg).tek().olc("gun")
                        if let s = n?.site, !s.isEmpty { Text(s).font(Yazi.orta(11.5 * u)).foregroundColor(pal.mu).tek().olc("bolge") }
                    } else { bos(u) }
                }
            }
        }
    }
    func harf(_ d: Date) -> String { ["P", "P", "S", "Ç", "P", "C", "C"][Calendar.current.component(.weekday, from: d) - 1] }
    @ViewBuilder func bos(_ u: CGFloat) -> some View {
        Spacer(minLength: 6 * u)
        Text("Sıradaki iğne yok").font(Yazi.outfit(17 * u)).foregroundColor(pal.fg).tek().olc("bos")
        Text("Hafif'te iğne ekleyince burada görünür").font(Yazi.orta(11 * u)).foregroundColor(pal.mu).lineLimit(2).minimumScaleFactor(0.7).olc("bos2")
        Spacer(minLength: 0)
    }
}

// MARK: - Kilo

@available(iOS 16.0, *)
struct KiloGorunum: View {
    let v: WVeri?; let an: Date; let boy: Boy
    let ac = Color.white.opacity(0.72)
    var body: some View {
        let k = v?.w
        switch boy {
        case .kilitDik:
            VStack(alignment: .leading, spacing: 1) {
                if let k = k {
                    Label("Kilo · \(Bicim.isaretli(k.change)) kg", systemImage: "leaf.fill").font(Yazi.bold(11)).tek().olc("ust")
                    Text("\(Bicim.kg(k.cur)) kg").font(Yazi.outfit(18)).tek().olc("deger")
                    Egri(pts: k.pts ?? [], renk: .primary, dolgu: false).frame(maxHeight: .infinity).olc("egri")
                } else {
                    Label("Kilo", systemImage: "leaf.fill").font(Yazi.bold(11))
                    Text("İlk tartını gir").font(Yazi.outfit(15)).tek()
                }
            }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        case .orta:
            Olcekli(boy: boy) { u in
                HStack(spacing: 10 * u) {
                    VStack(alignment: .leading, spacing: 0) {
                        Baslik(simge: "leaf.fill", renk: Pal.mint, yazi: "Kilo", yaziRenk: ac, u: u)
                        if let k = k {
                            Spacer(minLength: 4 * u)
                            deger(k, 32 * u, u)
                            Hap(yazi: "\(Bicim.isaretli(k.change)) kg başından", on: Pal.mint, arka: Pal.mint.opacity(0.14), u: u).padding(.top, 6 * u).olc("hap")
                            Spacer(minLength: 4 * u)
                            if let e = eta(k) {
                                (Text("Hedefe ").font(Yazi.orta(11.5 * u)).foregroundColor(ac) + Text(e).font(Yazi.bold(11.5 * u)).foregroundColor(.white) + Text(" civarı").font(Yazi.orta(11.5 * u)).foregroundColor(ac)).tek().olc("alt")
                            } else {
                                Text(alt(k)).font(Yazi.orta(11.5 * u)).foregroundColor(ac).tek().olc("alt")
                            }
                        } else { bos(u) }
                    }.frame(maxWidth: .infinity, alignment: .leading)
                    if let p = k?.pts, p.count >= 2 {
                        Egri(pts: p, renk: Pal.mint, dolgu: true).frame(maxWidth: .infinity).olc("egri")
                    }
                }
            }
        default:
            Olcekli(boy: boy) { u in
                VStack(alignment: .leading, spacing: 0) {
                    Baslik(simge: "leaf.fill", renk: Pal.mint, yazi: "Kilo", yaziRenk: ac, u: u)
                    if let k = k {
                        Spacer(minLength: 4 * u)
                        deger(k, 30 * u, u)
                        Hap(yazi: "\(Bicim.isaretli(k.change)) kg başından", on: Pal.mint, arka: Pal.mint.opacity(0.14), u: u).padding(.top, 6 * u).olc("hap")
                        Spacer(minLength: 6 * u)
                        if let pct = k.pct {
                            GeometryReader { g in
                                ZStack(alignment: .leading) { Capsule().fill(Color.white.opacity(0.14)); Capsule().fill(Pal.mint).frame(width: g.size.width * min(1, max(0.03, pct / 100))) }
                            }.frame(height: 6 * u).olc("cubuk")
                            Spacer(minLength: 5 * u).frame(maxHeight: 6 * u)
                        }
                        Text(alt(k)).font(Yazi.orta(11.5 * u)).foregroundColor(ac).tek().olc("alt")
                    } else { bos(u) }
                }
            }
        }
    }
    func deger(_ k: WVeri.Kilo, _ s: CGFloat, _ u: CGFloat) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 3 * u) {
            Text(Bicim.kg(k.cur)).font(Yazi.outfit(s)).foregroundColor(.white)
            Text("kg").font(Yazi.bold(13 * u)).foregroundColor(ac)
        }.tek().olc("deger")
    }
    func alt(_ k: WVeri.Kilo) -> String {
        if let g = k.goal, let l = k.left { return l <= 0 ? "Hedefe ulaştın" : "Hedef \(Bicim.sayi(g, g.truncatingRemainder(dividingBy: 1) == 0 ? 0 : 1)) kg · \(Bicim.kg(l)) kaldı" }
        return "Hedef belirlenmedi"
    }
    func eta(_ k: WVeri.Kilo) -> String? {
        guard let l = k.left, l > 0, let pw = k.perWeek, pw < -0.05 else { return nil }
        let hafta = l / -pw
        guard hafta < 156, let d = Calendar.current.date(byAdding: .day, value: Int(hafta * 7), to: an) else { return nil }
        return Bicim.ay(d, an)
    }
    @ViewBuilder func bos(_ u: CGFloat) -> some View {
        Spacer(minLength: 6 * u)
        Text("İlk tartını gir").font(Yazi.outfit(18 * u)).foregroundColor(.white).tek().olc("bos")
        Spacer(minLength: 0)
    }
}

// MARK: - Su

@available(iOS 16.0, *)
struct SuGorunum: View {
    let v: WVeri?; let an: Date; let boy: Boy; let pal: Pal
    var body: some View {
        let d = v?.gun(an), w = d?.w ?? 0, wg = max(1, d?.wg ?? 2500)
        let kalan = max(0, Int(ceil((wg - w) / 250)))
        switch boy {
        case .kilitYuvarlak:
            Gauge(value: min(1, w / wg)) {
                Image(systemName: "drop.fill")
            } currentValueLabel: {
                Text(Bicim.litre(w)).font(Yazi.outfit(15))
            }.gaugeStyle(.accessoryCircular)
        case .orta:
            Olcekli(boy: boy) { u in
                VStack(alignment: .leading, spacing: 0) {
                    Baslik(simge: "drop.fill", renk: pal.su, yazi: "Su", yaziRenk: pal.mu, u: u,
                           sag: AnyView(Text(kalan > 0 ? "\(kalan) bardak kaldı" : "Hedef tamam").font(Yazi.orta(11.5 * u)).foregroundColor(pal.mu).tek()))
                    Spacer(minLength: 4 * u)
                    deger(w, wg, u)
                    Spacer(minLength: 6 * u)
                    HStack(alignment: .bottom, spacing: 12 * u) {
                        Bardaklar(ml: w, hedef: wg, sutun: 10, renk: pal.su, u: u).frame(maxWidth: 240 * u).olc("bardak")
                        Spacer(minLength: 0)
                        SuDugme(pal: pal, u: u)
                    }
                }
            }
        default:
            Olcekli(boy: boy) { u in
                VStack(alignment: .leading, spacing: 0) {
                    Baslik(simge: "drop.fill", renk: pal.su, yazi: "Su", yaziRenk: pal.mu, u: u)
                    Spacer(minLength: 4 * u)
                    deger(w, wg, u)
                    Spacer(minLength: 6 * u)
                    HStack(alignment: .bottom, spacing: 8 * u) {
                        Bardaklar(ml: w, hedef: wg, sutun: 5, renk: pal.su, u: u).frame(maxWidth: 72 * u).olc("bardak")
                        Spacer(minLength: 0)
                        SuDugme(pal: pal, u: u)
                    }
                }
            }
        }
    }
    func deger(_ w: Double, _ wg: Double, _ u: CGFloat) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 4 * u) {
            Text(Bicim.litre(w)).font(Yazi.outfit(30 * u)).foregroundColor(pal.fg)
            Text("/ \(Bicim.litre(wg)) L").font(Yazi.bold(12 * u)).foregroundColor(pal.mu)
        }.tek().olc("deger")
    }
}

// MARK: - Pano (büyük): Android'deki Pano gibi kilo + bugün + sıradakiler

@available(iOS 16.0, *)
struct PanoGorunum: View {
    let v: WVeri?; let an: Date; let pal: Pal; let koyu: Bool
    let ac = Color.white.opacity(0.66)
    var ust: LinearGradient {
        koyu ? LinearGradient(colors: [Color(red: 0x13 / 255, green: 0x35 / 255, blue: 0x2E / 255), Color(red: 0x0E / 255, green: 0x21 / 255, blue: 0x1C / 255)], startPoint: .topLeading, endPoint: .bottomTrailing)
             : Pal.kiloArka
    }
    var body: some View {
        GeometryReader { g in
            let u = min(g.size.width / 338, g.size.height / 354)
            VStack(spacing: 0) {
                ustBolum(u).padding(.horizontal, 16 * u).padding(.top, 14 * u).padding(.bottom, 12 * u)
                    .frame(width: g.size.width, height: g.size.height * 0.5, alignment: .top).background(ust)
                altBolum(u).padding(.horizontal, 14 * u).padding(.top, 12 * u).padding(.bottom, 14 * u)
                    .frame(width: g.size.width, height: g.size.height * 0.5, alignment: .top)
            }
        }.coordinateSpace(name: "w")
    }

    // üst: kilo, değişim, eğri, hedef
    @ViewBuilder func ustBolum(_ u: CGFloat) -> some View {
        let k = v?.w
        VStack(alignment: .leading, spacing: 0) {
            Baslik(simge: "leaf.fill", renk: Pal.mint, yazi: "Hafif", yaziRenk: Pal.mint, u: u,
                   sag: AnyView(Text(Bicim.tarih(an)).font(Yazi.orta(11.5 * u)).foregroundColor(ac).tek()))
            if let k = k {
                Link(destination: URL(string: "hafif://w/tab/kilo")!) {
                    VStack(alignment: .leading, spacing: 0) {
                        HStack(alignment: .center, spacing: 8 * u) {
                            HStack(alignment: .firstTextBaseline, spacing: 4 * u) {
                                Text(Bicim.kg(k.cur)).font(Yazi.outfit(44 * u)).foregroundColor(.white)
                                Text("kg").font(Yazi.bold(14 * u)).foregroundColor(ac)
                            }.tek().olc("deger")
                            Spacer(minLength: 4 * u)
                            Hap(yazi: "\(Bicim.isaretli(k.change)) kg başından", on: Pal.mint, arka: Pal.mint.opacity(0.16), u: u).olc("hap")
                        }.padding(.top, 6 * u)
                        if let p = k.pts, p.count >= 2 {
                            Egri(pts: p, renk: Pal.mint, dolgu: true).frame(maxWidth: .infinity, maxHeight: .infinity).padding(.vertical, 4 * u).olc("egri")
                        } else { Spacer(minLength: 4 * u) }
                        hedef(k, u)
                    }
                }
            } else {
                Spacer(minLength: 6 * u)
                Text("İlk tartını gir").font(Yazi.outfit(22 * u)).foregroundColor(.white).tek().olc("bos")
                Text("kilo yolun burada görünecek").font(Yazi.orta(12 * u)).foregroundColor(ac).tek().olc("bos2")
                Spacer(minLength: 0)
            }
        }
    }
    @ViewBuilder func hedef(_ k: WVeri.Kilo, _ u: CGFloat) -> some View {
        if let pct = k.pct, let l = k.left {
            let yazi = l <= 0.05 ? "Hedefindesin" : "Hedefe \(Bicim.kg(l)) kg" + (eta(k).map { " · " + $0 } ?? "")
            HStack(spacing: 10 * u) {
                GeometryReader { g in
                    ZStack(alignment: .leading) { Capsule().fill(Color.white.opacity(0.14)); Capsule().fill(Pal.mint).frame(width: g.size.width * min(1, max(0.03, pct / 100))) }
                }.frame(height: 5 * u)
                Text(yazi).font(Yazi.bold(11.5 * u)).foregroundColor(.white).tek().layoutPriority(1)
            }.frame(height: 15 * u).olc("hedef")
        } else {
            Text(k.goal == nil ? "Hedef belirlenmedi" : "Hedefe ulaştın").font(Yazi.bold(11.5 * u)).foregroundColor(.white).tek().olc("hedef")
        }
    }
    func eta(_ k: WVeri.Kilo) -> String? {
        guard let l = k.left, l > 0, let pw = k.perWeek, pw < -0.05 else { return nil }
        let hafta = l / -pw
        guard hafta < 156, let d = Calendar.current.date(byAdding: .day, value: Int(hafta * 7), to: an) else { return nil }
        return Bicim.ay(d, an)
    }

    // alt: üç halka ve iki kart
    @ViewBuilder func altBolum(_ u: CGFloat) -> some View {
        let d = v?.gun(an) ?? WVeri.Gun(w: 0, wg: 2500, p: 0, pg: 100, st: nil, sg: 7500)
        let p = d.p ?? 0, pg = max(1, d.pg ?? 100), w = d.w ?? 0, wg = max(1, d.wg ?? 2500), sg = max(1, d.sg ?? 7500)
        VStack(spacing: 10 * u) {
            HStack(spacing: 0) {
                Link(destination: URL(string: "hafif://w/protein")!) {
                    halka(p / pg, pal.pro, "fork.knife", Bicim.sayi(p), "/ \(Bicim.sayi(pg)) g", u)
                }.frame(maxWidth: .infinity).olc("halka0")
                Group {
                    if #available(iOS 17.0, *) {
                        Button(intent: SuEkle()) { halka(w / wg, pal.su, "drop.fill", Bicim.litre(w), "/ \(Bicim.litre(wg)) L", u) }.buttonStyle(.plain)
                    } else {
                        Link(destination: URL(string: "hafif://w/water/250")!) { halka(w / wg, pal.su, "drop.fill", Bicim.litre(w), "/ \(Bicim.litre(wg)) L", u) }
                    }
                }.frame(maxWidth: .infinity).olc("halka1")
                Link(destination: URL(string: "hafif://w/tab/adim")!) {
                    halka((d.st ?? 0) / sg, pal.ad, "figure.walk", d.st.map { Bicim.sayi($0) } ?? "–", d.st == nil ? "bağla" : "adım", u)
                }.frame(maxWidth: .infinity).olc("halka2")
            }
            HStack(spacing: 8 * u) {
                kart1(u).olc("kart0")
                kart2(u).olc("kart1")
            }.frame(maxHeight: .infinity)
        }
    }
    func halka(_ oran: Double, _ renk: Color, _ simge: String, _ deger: String, _ birim: String, _ u: CGFloat) -> some View {
        VStack(spacing: 5 * u) {
            ZStack(alignment: .bottomTrailing) {
                ZStack {
                    Halka(v: oran, renk: renk, iz: pal.trk, kalin: 6 * u)
                    Image(systemName: simge).font(.system(size: 16 * u, weight: .semibold)).foregroundColor(renk)
                }.frame(width: 54 * u, height: 54 * u)
                Circle().fill(renk).frame(width: 20 * u, height: 20 * u)
                    .overlay(Image(systemName: "plus").font(.system(size: 10 * u, weight: .bold)).foregroundColor(pal.on))
                    .overlay(Circle().stroke(pal.bg, lineWidth: 2 * u)).offset(x: 4 * u, y: 2 * u)
            }
            (Text(deger).font(Yazi.outfit(14.5 * u)).foregroundColor(pal.fg) + Text(" " + birim).font(Yazi.orta(11 * u)).foregroundColor(pal.mu)).tek()
                .frame(maxWidth: .infinity)
        }.frame(maxWidth: .infinity)
    }
    func kart(_ simge: String, _ renk: Color, _ arka: Color, _ baslik: String, _ alt: String, _ adres: String, _ u: CGFloat) -> some View {
        Link(destination: URL(string: adres)!) {
            HStack(spacing: 9 * u) {
                Image(systemName: simge).font(.system(size: 17 * u, weight: .semibold)).foregroundColor(renk).frame(width: 22 * u)
                VStack(alignment: .leading, spacing: 2 * u) {
                    Text(baslik).font(Yazi.bold(13 * u)).foregroundColor(pal.fg).tek()
                    Text(alt).font(Yazi.orta(11.5 * u)).foregroundColor(pal.mu).tek()
                }
                Spacer(minLength: 0)
            }.padding(.horizontal, 11 * u).frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(RoundedRectangle(cornerRadius: 14 * u).fill(arka))
        }
    }
    /// sol kart: sıradaki iğne; iğne kullanmayanda saate göre Ne yesem? önerisi
    @ViewBuilder func kart1(_ u: CGFloat) -> some View {
        if v?.shots == true, let n = v?.next {
            let t = Date(timeIntervalSince1970: n.ts / 1000), f = Bicim.gunFarki(t, an)
            let gun = f <= 0 ? "Bugün" : f == 1 ? "Yarın" : Bicim.gunAdi(t)
            kart("syringe", pal.ig, pal.igS, "\(gun) \(Bicim.saat(t))", (n.site ?? "").isEmpty ? "sıradaki iğne" : n.site!, "hafif://w/tab/igne", u)
        } else {
            let s = Calendar.current.component(.hour, from: an)
            let d = v?.gun(an), kalan = (d?.pg ?? 100) - (d?.p ?? 0)
            if kalan >= 10, let m = v?.meals?[s < 11 ? "k" : s >= 21 ? "a" : "o"]?.first, let id = m.id, let ad = m.s {
                kart("fork.knife", pal.pro, pal.proS, ad, "+\(Bicim.sayi(m.g ?? 0)) g protein", "hafif://w/meal/\(id)", u)
            } else {
                kart("fork.knife", pal.pro, pal.proS, "Ne yesem?", "öneriler Günlük'te", "hafif://w/tab/besin", u)
            }
        }
    }
    /// sağ kart: sıradaki takviye vakti; takviye yoksa hedefe kalan ya da tartı
    @ViewBuilder func kart2(_ u: CGFloat) -> some View {
        let bugun = WVeri.gunAdi(an), taze = v?.date == bugun
        let L = v?.supp?.first(where: { $0.d == bugun })?.s ?? []
        let of = L.reduce(0) { $0 + ($1.of ?? 0) }, done = taze ? L.reduce(0) { $0 + ($1.done ?? 0) } : 0
        if of > 0 {
            if let nx = L.first(where: { (taze ? ($0.done ?? 0) : 0) < ($0.of ?? 0) }) {
                kart("pills.fill", pal.tk, pal.tkS, [nx.n, nx.t].compactMap { $0 }.joined(separator: " "), "\(Bicim.sayi(nx.of ?? 0)) takviye", "hafif://w/tab/takviye", u)
            } else {
                kart("pills.fill", pal.tk, pal.tkS, "Hepsi alındı", "bugün \(Bicim.sayi(done))/\(Bicim.sayi(of))", "hafif://w/tab/takviye", u)
            }
        } else if let k = v?.w, let l = k.left, k.pct != nil {
            kart("flag.fill", pal.ki, pal.kiS, l <= 0.05 ? "Hedefindesin" : "\(Bicim.kg(max(0, l))) kg kaldı", "hedefe", "hafif://w/tab/basari", u)
        } else {
            kart("scalemass", pal.ki, pal.kiS, "Kilo gir", "bugünkü tartın", "hafif://w/weight", u)
        }
    }
}

// MARK: - widget'ların ortak kabı

enum Tur: String, CaseIterable { case bugun, igne, kilo, su, pano, panoKoyu }

@available(iOS 16.0, *)
struct HafifKart: View {
    let tur: Tur; let e: HEntry; let boy: Boy; let koyu: Bool
    /// true: boyut kontrolü / önizleme (arka plan ve kenar boşluğu elle çizilir)
    var onizleme = false
    var body: some View {
        // Pano'nun rengi telefonun temasına değil widget'ın türüne bağlı (iki ayrı widget)
        let pal = Pal(koyu: tur == .pano ? false : tur == .panoKoyu ? true : koyu)
        let pano = tur == .pano || tur == .panoKoyu
        let ic = Group {
            switch tur {
            case .bugun: BugunGorunum(v: e.v, an: e.date, boy: boy, pal: pal)
            case .igne: IgneGorunum(v: e.v, an: e.date, boy: boy, pal: pal)
            case .kilo: KiloGorunum(v: e.v, an: e.date, boy: boy)
            case .su: SuGorunum(v: e.v, an: e.date, boy: boy, pal: pal)
            case .pano, .panoKoyu: PanoGorunum(v: e.v, an: e.date, pal: pal, koyu: tur == .panoKoyu)
            }
        }
        let kilit = boy == .kilitDik || boy == .kilitYuvarlak || boy == .kilitSatir
        if kilit {
            if onizleme { ic.coordinateSpace(name: "w").foregroundColor(.white).background(Color(white: 0.22)) }
            else if #available(iOS 17.0, *) { ic.containerBackground(for: .widget) { Color.clear } }
            else { ic }
        } else if pano {
            // Pano kenar boşluğunu kendisi bırakır (üst zümrüt bölüm kenara kadar uzanır)
            if onizleme { ic.background(arka(pal)) }
            else if #available(iOS 17.0, *) { ic.containerBackground(for: .widget) { arka(pal) } }
            else { ic.background(arka(pal)) }
        } else if onizleme {
            GeometryReader { g in
                ic.padding(14 * g.size.height / 158)
                    .background(arka(pal))
            }
        } else if #available(iOS 17.0, *) {
            ic.containerBackground(for: .widget) { arka(pal) }
        } else {
            ic.padding(14).background(arka(pal))
        }
    }
    @ViewBuilder func arka(_ pal: Pal) -> some View {
        if tur == .kilo { Pal.kiloArka } else { pal.bg }
    }
}

extension Tur {
    var adres: URL {
        switch self {
        case .bugun: return URL(string: "hafif://w/tab/besin")!
        case .igne: return URL(string: "hafif://w/tab/igne")!
        case .kilo: return URL(string: "hafif://w/tab/kilo")!
        case .su: return URL(string: "hafif://w/tab/besin:su")!
        case .pano, .panoKoyu: return URL(string: "hafif://w/tab/ozet")!
        }
    }
}
