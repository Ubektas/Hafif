import Foundation
import Capacitor
import WidgetKit

/// iPhone widget köprüsü. Uygulama widget.json'u Belgeler klasörüne yazar (Android ile aynı kod);
/// refresh() onu widget'larla paylaşılan alana kopyalayıp widget'ları yeniler.
@objc(HafifWidgetPlugin)
public class HafifWidgetPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "HafifWidgetPlugin"
    public let jsName = "HafifWidget"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "refresh", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pending", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "bars", returnType: CAPPluginReturnPromise),
    ]

    @objc func refresh(_ call: CAPPluginCall) {
        let kaynak = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("widget.json")
        guard let hedef = HafifOrtak.dosya else { call.reject("Paylaşılan alan yok (App Group)"); return }
        do {
            let d = try Data(contentsOf: kaynak)
            try d.write(to: hedef, options: .atomic)
            WidgetCenter.shared.reloadAllTimelines()
            call.resolve()
        } catch { call.reject("widget.json kopyalanamadı: \(error.localizedDescription)") }
    }

    /// Widget'tan eklenen ve henüz uygulamaya işlenmemiş su kayıtları (okununca silinir).
    @objc func pending(_ call: CAPPluginCall) {
        guard let a = HafifOrtak.ayar else { call.resolve(["items": []]); return }
        let L = a.array(forKey: HafifBekleyen.anahtar) as? [[String: Any]] ?? []
        a.removeObject(forKey: HafifBekleyen.anahtar)
        call.resolve(["items": L])
    }

    /// Android'de durum çubuğu rengi; iPhone'da gerek yok.
    @objc func bars(_ call: CAPPluginCall) { call.resolve() }
}
