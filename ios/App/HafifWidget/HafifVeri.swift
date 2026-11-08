import Foundation
import WidgetKit

/// Uygulama ile widget arasındaki ortak alan. Uygulama widget.json'u buraya kopyalar, widget buradan okur.
enum HafifOrtak {
    static let grup = "group.com.ugurbektas.hafif"
    static var klasor: URL? { FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: grup) }
    static var dosya: URL? { klasor?.appendingPathComponent("widget.json") }
    static var ayar: UserDefaults? { UserDefaults(suiteName: grup) }
}

/// Uygulamanın widgetData() ile yazdığı JSON'un widget'ların kullandığı kısmı.
struct WVeri: Codable {
    struct Siradaki: Codable { var ts: Double; var dose: String?; var site: String? }
    struct Gun: Codable { var w: Double?; var wg: Double?; var p: Double?; var pg: Double?; var st: Double?; var sg: Double? }
    struct Kilo: Codable { var cur: Double; var change: Double; var goal: Double?; var left: Double?; var pct: Double?; var pts: [[Double]]?; var perWeek: Double? }
    var date: String?
    var shots: Bool?
    var next: Siradaki?
    var day: Gun?
    var w: Kilo?
    /// Pano için: saate göre öğün önerileri (k/o/a) ve 7 günlük takviye vakitleri
    struct Yemek: Codable { var id: String?; var s: String?; var g: Double? }
    struct Vakit: Codable { var n: String?; var t: String?; var done: Double?; var of: Double? }
    struct TGun: Codable { var d: String?; var s: [Vakit]? }
    var meals: [String: [Yemek]]? = nil
    var supp: [TGun]? = nil

    static func oku() -> WVeri? {
        guard let u = HafifOrtak.dosya, let d = try? Data(contentsOf: u) else { return nil }
        return try? JSONDecoder().decode(WVeri.self, from: d)
    }

    /// Gün değiştiyse günlük değerler sıfırdan başlar.
    func gun(_ an: Date) -> Gun {
        guard let day = day, date == WVeri.gunAdi(an) else {
            return Gun(w: 0, wg: day?.wg ?? 2500, p: 0, pg: day?.pg ?? 100, st: nil, sg: day?.sg ?? 7500)
        }
        return day
    }

    static func gunAdi(_ d: Date) -> String {
        let f = DateFormatter(); f.calendar = Calendar(identifier: .gregorian); f.locale = Locale(identifier: "en_US_POSIX"); f.dateFormat = "yyyy-MM-dd"
        return f.string(from: d)
    }
}

struct HEntry: TimelineEntry {
    let date: Date
    let v: WVeri?
}

struct HSaglayici: TimelineProvider {
    func placeholder(in context: Context) -> HEntry { HEntry(date: Date(), v: Ornek.normal) }
    func getSnapshot(in context: Context, completion: @escaping (HEntry) -> Void) {
        completion(HEntry(date: Date(), v: context.isPreview ? (WVeri.oku() ?? Ornek.normal) : WVeri.oku()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<HEntry>) -> Void) {
        let now = Date(), v = WVeri.oku()
        let cal = Calendar.current
        let gece = cal.startOfDay(for: cal.date(byAdding: .day, value: 1, to: now)!)
        var e = [HEntry(date: now, v: v), HEntry(date: gece.addingTimeInterval(5), v: v)]
        // iğne günü geçince sayaç değişsin
        if let ts = v?.next?.ts { let t = Date(timeIntervalSince1970: ts / 1000); if t > now && t < gece { e.insert(HEntry(date: t.addingTimeInterval(60), v: v), at: 1) } }
        completion(Timeline(entries: e, policy: .after(gece.addingTimeInterval(60))))
    }
}

/// Önizleme ve boyut kontrolü için örnek değerler (uygulamada veri yokken widget galerisinde de bunlar görünür).
enum Ornek {
    static func an(_ g: Int, _ s: Int, _ d: Int) -> Double {
        let cal = Calendar.current
        let t = cal.date(bySettingHour: s, minute: d, second: 0, of: cal.date(byAdding: .day, value: g, to: Date())!)!
        return t.timeIntervalSince1970 * 1000
    }
    static var normal: WVeri {
        WVeri(date: WVeri.gunAdi(Date()), shots: true, next: .init(ts: an(5, 9, 0), dose: "7,5", site: "karın (sol)"),
              day: .init(w: 1750, wg: 2500, p: 74, pg: 120, st: 6240, sg: 7500),
              w: .init(cur: 88.6, change: -3.8, goal: 82, left: 6.6, pct: 37, pts: [[0, 91.2], [4, 90.6], [8, 90.1], [12, 89.8], [16, 89.4], [20, 89.1], [24, 88.9], [29, 88.6]], perWeek: -0.6),
              meals: ["k": [.init(id: "menemen", s: "Menemen", g: 19)], "o": [.init(id: "tavuk", s: "Izgara tavuk", g: 35)], "a": [.init(id: "mercimek", s: "Mercimek çorbası", g: 12)]],
              supp: [.init(d: WVeri.gunAdi(Date()), s: [.init(n: "Sabah", t: "07:30", done: 1, of: 1), .init(n: "Akşam", t: "19:00", done: 0, of: 2)])])
    }
    /// iğne kullanmayan: sıradaki iğne yok, Pano'da iğne kartı yerine Ne yesem? önerisi
    static var ignesiz: WVeri { var v = normal; v.shots = false; v.next = nil; return v }
    static var uzun: WVeri {
        WVeri(date: WVeri.gunAdi(Date()), shots: true, next: .init(ts: an(12, 21, 45), dose: "12,5", site: "uyluk (sağ)"),
              day: .init(w: 3250, wg: 4000, p: 118, pg: 160, st: 14820, sg: 12000),
              w: .init(cur: 124.8, change: -18.6, goal: 95, left: 29.8, pct: 38, pts: [[0, 129.4], [6, 128.2], [12, 127.0], [18, 126.1], [24, 125.3], [29, 124.8]], perWeek: -0.9),
              meals: ["k": [.init(id: "yulaf", s: "Yoğurtlu yulaf ve ceviz", g: 25)], "o": [.init(id: "kofte", s: "Izgara köfte ve bulgur pilavı", g: 32)], "a": [.init(id: "somon", s: "Fırında somon ve salata", g: 34)]],
              supp: [.init(d: WVeri.gunAdi(Date()), s: [.init(n: "Gece", t: "22:30", done: 0, of: 12)])])
    }
}
