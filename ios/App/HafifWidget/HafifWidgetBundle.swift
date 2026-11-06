import SwiftUI
import WidgetKit

@main
struct HafifWidgetBundle: WidgetBundle {
    var body: some Widget {
        BugunWidget()
        IgneWidget()
        KiloWidget()
        SuWidget()
    }
}

struct HafifGiris: View {
    let tur: Tur; let e: HEntry
    @Environment(\.widgetFamily) var aile
    @Environment(\.colorScheme) var tema
    var body: some View {
        HafifKart(tur: tur, e: e, boy: Boy(aile), koyu: tema == .dark).widgetURL(tur.adres)
    }
}

struct BugunWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HafifBugun", provider: HSaglayici()) { HafifGiris(tur: .bugun, e: $0) }
            .configurationDisplayName("Bugün")
            .description("Protein, su ve adım bir arada.")
            .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}

struct IgneWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HafifIgne", provider: HSaglayici()) { HafifGiris(tur: .igne, e: $0) }
            .configurationDisplayName("Sıradaki iğne")
            .description("Kaç gün kaldı, doz ve bölge.")
            .supportedFamilies([.systemSmall, .systemMedium, .accessoryInline])
    }
}

struct KiloWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HafifKilo", provider: HSaglayici()) { HafifGiris(tur: .kilo, e: $0) }
            .configurationDisplayName("Kilo")
            .description("Güncel kilo, değişim ve hedefe kalan.")
            .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}

struct SuWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HafifSu", provider: HSaglayici()) { HafifGiris(tur: .su, e: $0) }
            .configurationDisplayName("Su")
            .description("Bardaklar ve tek dokunuşla su.")
            .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular])
    }
}
