import SwiftUI
import UIKit
import CoreText

/// Yalnızca simülatör testinde (-hafifWidgetTest ile açılınca) çalışır: her widget'ı bütün iPhone boylarında çizer,
/// her yazı ve düğmenin kutusunu ölçer; üst üste binen ya da widget'tan taşan parça varsa hata yazar.
/// Sonuç ve görüntüler: Belgeler/widget-test/
@available(iOS 16.0, *)
enum WidgetDeneme {
    // iPhone widget boyları (pt): SE, mini/SE2-3, 15-17, Plus, Pro Max
    static let kucuk: [CGFloat] = [141, 148, 158, 169, 170]
    static let orta: [(CGFloat, CGFloat)] = [(292, 141), (321, 148), (338, 158), (360, 169), (364, 170)]
    static let dik: [(CGFloat, CGFloat)] = [(155, 66), (160, 72), (172, 76)]
    static let yuvarlak: [CGFloat] = [68, 72, 76]

    @MainActor static func calistir() {
        for f in ["hafif_outfit_bold", "hafif_figtree_bold", "hafif_figtree_medium"] {
            if let u = Bundle.main.url(forResource: f, withExtension: "ttf") { CTFontManagerRegisterFontsForURL(u as CFURL, .process, nil) }
        }
        let klasor = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("widget-test")
        try? FileManager.default.removeItem(at: klasor)
        try? FileManager.default.createDirectory(at: klasor, withIntermediateDirectories: true)
        var hatalar: [String] = [], toplam = 0, olcumsuz = 0
        let aileler: [(Tur, [Boy])] = [(.bugun, [.kucuk, .orta, .kilitDik]), (.igne, [.kucuk, .orta]), (.kilo, [.kucuk, .orta, .kilitDik]), (.su, [.kucuk, .orta, .kilitYuvarlak])]
        let veriler: [(String, WVeri?)] = [("normal", Ornek.normal), ("uzun", Ornek.uzun), ("bos", nil)]
        for (tur, boylar) in aileler {
            for boy in boylar {
                let olculer: [(CGFloat, CGFloat)] = boy == .kucuk ? kucuk.map { ($0, $0) } : boy == .orta ? orta : boy == .kilitDik ? dik : yuvarlak.map { ($0, $0) }
                for (vad, v) in veriler {
                    for koyu in [false, true] {
                        for (w, h) in olculer {
                            toplam += 1
                            OlcKayit.acik = true; OlcKayit.kutular = [:]
                            let e = HEntry(date: Date(), v: v)
                            let gor = HafifKart(tur: tur, e: e, boy: boy, koyu: koyu, onizleme: true)
                                .frame(width: w, height: h).clipShape(RoundedRectangle(cornerRadius: boy == .kilitYuvarlak ? w / 2 : 22 * h / 158))
                                .background(koyu ? Color.black : Color(white: 0.85))
                                .environment(\.colorScheme, koyu ? .dark : .light)
                            let r = ImageRenderer(content: gor); r.scale = 2
                            guard let img = r.uiImage else { hatalar.append("\(tur.rawValue)-\(boy.rawValue) \(Int(w))x\(Int(h)): çizilemedi"); continue }
                            OlcKayit.acik = false
                            let ad = "\(tur.rawValue)-\(boy.rawValue)-\(vad)-\(koyu ? "koyu" : "acik")-\(Int(w))x\(Int(h))"
                            if !(vad == "bos" && koyu) { try? img.pngData()?.write(to: klasor.appendingPathComponent(ad + ".png")) }
                            // içerik alanı: kilit ekranında tüm kutu, ana ekranda kenar boşluğu düşülmüş alan
                            let kilit = boy == .kilitDik || boy == .kilitYuvarlak
                            let pad = kilit ? 0 : 14 * h / 158
                            let alan = CGRect(x: 0, y: 0, width: w - 2 * pad, height: h - 2 * pad).insetBy(dx: -0.75, dy: -0.75)
                            let K = OlcKayit.kutular.filter { $0.value.width > 0.5 && $0.value.height > 0.5 }
                            if K.isEmpty && boy != .kilitYuvarlak { olcumsuz += 1 }
                            var sorun: [String] = []
                            for (id, r) in K where !alan.contains(r) { sorun.append("\(id) taşıyor (\(Int(r.minX)),\(Int(r.minY)),\(Int(r.maxX)),\(Int(r.maxY)) / \(Int(alan.width))x\(Int(alan.height)))") }
                            let L = K.sorted { $0.key < $1.key }
                            for i in 0..<L.count { for j in (i + 1)..<max(i + 1, L.count) {
                                let k = L[i].value.intersection(L[j].value)
                                if !k.isNull && k.width > 0.75 && k.height > 0.75 { sorun.append("\(L[i].key) ile \(L[j].key) üst üste") }
                            } }
                            if !sorun.isEmpty { hatalar.append("\(ad): " + sorun.joined(separator: "; ")) }
                        }
                    }
                }
            }
        }
        if olcumsuz > toplam / 2 { hatalar.append("ölçüm yapılamadı (\(olcumsuz)/\(toplam))") }
        let sonuc: [String: Any] = ["toplam": toplam, "hata": hatalar.count, "hatalar": hatalar]
        if let d = try? JSONSerialization.data(withJSONObject: sonuc, options: [.prettyPrinted]) { try? d.write(to: klasor.appendingPathComponent("sonuc.json")) }
        try? "bitti".write(to: klasor.appendingPathComponent("BITTI"), atomically: true, encoding: .utf8)
        NSLog("HAFIF_WIDGET_TEST toplam=\(toplam) hata=\(hatalar.count)")
    }
}
