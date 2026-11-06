import AppIntents
import Foundation
import WidgetKit

/// Widget'tan uygulamayı açmadan su ekleme (iOS 17+). Eklenen su ortak alanda bekler; uygulama açılınca kendi kaydına ekler.
enum HafifBekleyen {
    static let anahtar = "bekleyen"
    static func suEkle(_ ml: Double) {
        let simdi = Date()
        let gun = WVeri.gunAdi(simdi)
        if let a = HafifOrtak.ayar {
            var L = a.array(forKey: anahtar) as? [[String: Any]] ?? []
            L.append(["k": "w", "v": ml, "t": simdi.timeIntervalSince1970 * 1000, "d": gun])
            a.set(L, forKey: anahtar)
        }
        // widget hemen yeni değeri göstersin
        if let u = HafifOrtak.dosya, let d = try? Data(contentsOf: u), var o = (try? JSONSerialization.jsonObject(with: d)) as? [String: Any] {
            if (o["date"] as? String) != gun { o["date"] = gun; var g = o["day"] as? [String: Any] ?? [:]; g["w"] = 0; g["p"] = 0; g["st"] = NSNull(); o["day"] = g }
            var g = o["day"] as? [String: Any] ?? [:]
            g["w"] = ((g["w"] as? Double) ?? 0) + ml
            o["day"] = g
            if let yeni = try? JSONSerialization.data(withJSONObject: o) { try? yeni.write(to: u, options: .atomic) }
        }
    }
}

@available(iOS 16.0, *)
struct SuEkle: AppIntent {
    static var title: LocalizedStringResource = "250 ml su ekle"
    static var description = IntentDescription("Hafif'e 250 ml su ekler.")
    static var openAppWhenRun: Bool = false
    func perform() async throws -> some IntentResult {
        HafifBekleyen.suEkle(250)
        WidgetCenter.shared.reloadAllTimelines()
        return .result()
    }
}
