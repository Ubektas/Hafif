package com.ugurbektas.hafif.widget;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RadialGradient;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.text.TextPaint;

import androidx.core.content.res.ResourcesCompat;

import com.ugurbektas.hafif.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Widget'ları tek bir bitmap olarak çizer. Koordinatlar dp cinsindendir; tuval ekran yoğunluğuna göre ölçeklenir.
 * Geniş görünümlerde alttaki düğmeler (14dp kenar, 32dp yükseklik) üst katmandaki tıklama alanlarıyla hizalıdır.
 */
final class WidgetRenderer {
    static final int MINT = 0xFF9FF0D6, WHITE = 0xFFFFFFFF, EM = 0xFF0B3B33, ACC = 0xFF0E7C66, MUTED = 0xFF5F726C,
            WATER = 0xFF3A9AD6, PROT = 0xFFD98A3D, STEP = 0xFF1C8EA6, SHOT = 0xFFA9B8F0, SUPP = 0xFFD6CBF7, GOLD = 0xFFE8C877;

    static final class Result {
        Bitmap bmp;
        String main;
        final List<String[]> buttons = new ArrayList<>(); // {etiket, eylem}
        float buttonsLeft = 14; // düğme sırasının sol kenarı (dp)
    }

    private final Typeface fm, fb, db;
    private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final TextPaint tp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
    private Canvas c;
    private float W, H;
    private boolean dark;

    WidgetRenderer(Context ctx) { this(ctx, null); }

    /** forceNight: önizlemede koyu/açık çizimi zorlamak için; null ise telefonun teması. */
    WidgetRenderer(Context ctx, Boolean forceNight) {
        Typeface a = null, b = null, d = null;
        try {
            a = ResourcesCompat.getFont(ctx, R.font.hafif_figtree_medium);
            b = ResourcesCompat.getFont(ctx, R.font.hafif_figtree_bold);
            d = ResourcesCompat.getFont(ctx, R.font.hafif_outfit_bold);
        } catch (Exception ignored) {
        }
        fm = a != null ? a : Typeface.DEFAULT;
        fb = b != null ? b : Typeface.DEFAULT_BOLD;
        db = d != null ? d : Typeface.DEFAULT_BOLD;
        night = forceNight != null ? forceNight : (ctx.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
        // 2.0 tasarımı: açık temada krem kart, koyu temada koyu zümrüt kart; tek mesaj, emoji, en fazla bir ana düğme
        BG = night ? 0xFF0F2622 : 0xFFF7F4EE;
        FG = night ? 0xFFE8F5F0 : 0xFF0B2420;
        MU = night ? 0xFF93ABA3 : 0xFF5F726C;
        AC = night ? MINT : ACC;
        BTN = night ? MINT : EM;
        BTNF = night ? EM : WHITE;
        SOFT = night ? 0x1F9FF0D6 : 0xFFEAF2EE;
        TRACK = night ? 0x24FFFFFF : 0xFFE3EAE6;
    }

    private final boolean night;
    private final int BG, FG, MU, AC, BTN, BTNF, SOFT, TRACK;

    Result render(int kind, WidgetData d, float wDp, float hDp, float density) {
        Result r = new Result();
        float s = density;
        double px = wDp * hDp * s * s;
        if (px > 1_400_000) s = (float) Math.sqrt(1_400_000 / (wDp * hDp));
        Bitmap bmp = Bitmap.createBitmap(Math.max(1, Math.round(wDp * s)), Math.max(1, Math.round(hDp * s)), Bitmap.Config.ARGB_8888);
        c = new Canvas(bmp);
        c.scale(s, s);
        W = wDp;
        H = hDp;
        if (!d.has()) {
            empty("🌿", "Hafif'i bir kez aç", "widget verileri hazırlansın");
            r.main = "tab/ozet";
        } else {
            draw(kind, d, r);
            if (!d.plus()) {
                r.buttons.clear();
                bmp = locked(bmp, s);
                r.main = "plus";
            }
        }
        r.bmp = bmp;
        return r;
    }

    // ---------- 11 widget ----------
    private void draw(int k, WidgetData d, Result r) {
        boolean wide = W >= 230, tall = H >= 130;
        switch (k) {
            case 1: dongu(d, r, wide); break;
            case 2: siradaki(d, r, wide, tall); break;
            case 3: bugun(d, r, wide); break;
            case 4: kilo(d, r, wide, tall); break;
            case 5: grafik(d, r, wide); break;
            case 6: hedef(d, r, wide); break;
            case 7: su(d, r, wide); break;
            case 8: protein(d, r, wide); break;
            case 9: adim(d, r, wide); break;
            case 11: yemek(d, r, wide); break;
            default: takviye(d, r, wide); break;
        }
    }

    /** Boş durum: ortada emoji, başlık ve tek satır açıklama. */
    private void empty(String emoji, String t, String sub) {
        bg();
        textC(emoji, W / 2, H / 2 - 12, Math.min(30, H * 0.22f), fm, FG);
        center(t, H / 2 + 14, 14, db, FG);
        center(sub, H / 2 + 31, 11, fm, MU);
    }

    /** Küçük widget başlığı: solda emoji, sağda harf aralıklı etiket. */
    private void head(String emoji, String label, int col) {
        textC(emoji, 16 + 12, 36, 24, fm, FG);
        tp.setLetterSpacing(0);
        textRs(label, W - 16, 26, 9, fb, col, 1.3f);
    }

    /** Alçak boy (küçültülmüş) küçük widget: üstte küçük emoji ve etiket, altında büyük değer; yer varsa alt satır ve çubuk. */
    private boolean low() { return H < 120; }

    private void compact(String emoji, String label, int col, String big, String sub, float frac, int barCol) {
        textC(emoji, 24, 26, 14, fm, FG);
        text(label, 38, 25, 9, fb, col, W - 54, 1.3f);
        boolean hasSub = sub != null && H >= 96, hasBar = frac >= 0;
        float y = hasSub ? Math.min(H - 38, 58) : Math.min(H - (hasBar ? 22 : 14), 56);
        text(big, 16, y, big.length() > 11 ? 18 : 22, db, FG, W - 32);
        if (hasSub) text(sub, 16, y + 16, 11, fm, MU, W - 32);
        if (hasBar) bar(16, H - 16, W - 32, 5, Math.max(0, Math.min(1, frac)), barCol, TRACK);
    }

    /** Geniş widget başlığı: yaprak ve etiket solda. */
    private void headL(String label, float x, int col) {
        leaf(x, 26, col);
        text(label, x + 16, 26, 9.5f, fb, col, W - x - 140, 1.3f);
    }

    private boolean noShots(WidgetData d, Result r) {
        if (d.shots() && d.cyc() != null) return false;
        if (d.shots()) empty("💉", "Henüz iğne yok", "ilk iğneni Hafif'e ekle");
        else empty("💉", "İğne takibi kapalı", "Ayarlar'dan açabilirsin");
        r.main = d.shots() ? "shot" : "tab/ayar";
        return true;
    }

    /** "Bugün", "Yarın", "Pazar", "Gecikti". */
    private String dayWord(WidgetData d) {
        long ts = d.nextTs();
        if (ts == 0) return "–";
        if (ts < d.now - 6 * 3600_000L) return "Gecikti";
        int dd = WidgetData.dayDiff(d.now, ts);
        if (dd <= 0) return "Bugün";
        if (dd == 1) return "Yarın";
        return WidgetData.cap(new java.text.SimpleDateFormat("EEEE", WidgetData.TR).format(new java.util.Date(ts)));
    }

    private String hm(long ts) { return new java.text.SimpleDateFormat("HH:mm", WidgetData.TR).format(new java.util.Date(ts)); }

    private void dongu(WidgetData d, Result r, boolean wide) {
        r.main = "tab/ozet";
        if (noShots(d, r)) return;
        bg();
        String ph = d.phaseName();
        String sub = d.cycleDay() == 1 ? "iğne günü" : "iğneden sonraki " + (d.cycleDay() - 1) + ". gün";
        if (!wide && low()) { compact("🌙", "DÖNGÜ", AC, ph, sub, d.cycleFrac(), AC); return; }
        if (!wide) {
            head("🌙", "DÖNGÜ", AC);
            text(ph, 16, H - 54, 26, db, FG, W - 32);
            text(sub, 16, H - 36, 11.5f, fm, MU, W - 32);
            bar(16, H - 24, W - 32, 6, d.cycleFrac(), AC, TRACK);
            return;
        }
        headL("DÖNGÜ · " + d.cycleDay() + "/" + d.cycleDays(), 16, AC);
        textR("🌙", W - 16, 34, 24, fm, FG);
        boolean lo = H < 140;
        text(ph + " evresi", 16, lo ? 58 : 66, lo ? 22 : 26, db, FG, W - 32);
        if (!lo) wrap(d.phaseTip(), 16, 86, W - 32, 12, fm, MU, 2);
        bar(16, lo ? H - 36 : H - 46, W - 32, 6, d.cycleFrac(), AC, TRACK);
        text("Yeni iğne: " + dayWord(d).toLowerCase(WidgetData.TR) + " " + (d.nextTs() > 0 ? hm(d.nextTs()) : ""), 16, H - 20, 11.5f, fb, FG, W - 32);
    }

    private void siradaki(WidgetData d, Result r, boolean wide, boolean tall) {
        r.main = "shot";
        if (noShots(d, r)) return;
        bg();
        JSONObject n = d.next();
        String day = dayWord(d), site = n == null ? "" : n.optString("site", "");
        String when = (d.nextTs() > 0 ? hm(d.nextTs()) : "") + (site.isEmpty() ? "" : " · " + site.toLowerCase(WidgetData.TR));
        if (!tall) {
            float ic = Math.min(44, H - 24), y0 = (H - ic) / 2;
            rrect(14, y0, ic, ic, 14, SOFT);
            textC("💉", 14 + ic / 2, y0 + ic * 0.68f, ic * 0.5f, fm, FG);
            float x = 14 + ic + 12;
            text(day, x, H / 2 + 2, wide ? 22 : 19, db, FG, W - x - 12);
            text(when, x, H / 2 + 19, 11, fm, MU, W - x - 12);
            return;
        }
        if (!wide) {
            head("💉", "İĞNE", AC);
            text(day, 16, H - 38, day.length() > 7 ? 24 : 30, db, FG, W - 32);
            text(when, 16, H - 18, 11.5f, fm, MU, W - 32);
            return;
        }
        headL("SIRADAKİ İĞNE", 16, AC);
        float rx = W - 16 - 132;
        text(day, 16, 72, 28, db, FG, W - 32);
        text((d.nextTs() > 0 ? hm(d.nextTs()) : "") + (site.isEmpty() ? "" : " · önerilen bölge: " + site.toLowerCase(WidgetData.TR)), 16, 92, 11.5f, fm, MU, W - 32);
        String dose = n == null ? "" : n.optString("dose", "");
        if (n != null && n.has("pen") && !n.isNull("pen") && n.optInt("pen") <= 1) {
            rrect(rx, 14, 132, 46, 14, SOFT);
            textC("🛒", rx + 20, 43, 18, fm, FG);
            wrap(n.optInt("pen") <= 0 ? "Kalem bitti, yeni kalem" : "Son doz, yeni kalem al", rx + 36, 33, 88, 10.5f, fb, FG, 2);
        } else if (!dose.isEmpty()) {
            chipR(dose + " mg", W - 16, 14, 11, SOFT, FG);
        }
        buttonsAt(r, rx, new String[][]{{"İğneyi kaydet", "shot"}}, new int[]{BTN}, new int[]{BTNF});
    }

    private String waterWord(double f) {
        if (f >= 1) return "Tamam ✓";
        if (f >= 0.75) return "Az kaldı";
        if (f >= 0.4) return "Yarıda";
        return f > 0 ? "Başladın" : "Henüz yok";
    }

    private void bugun(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg();
        double w = d.water(), wg = d.waterGoal(), pr = d.protein(), pg = d.proteinGoal(), st = d.steps(), sg = d.stepGoal();
        boolean hs = d.hasSteps();
        String[] em = {"💧", "🍳", "👟"}, nm = {"Su", "Protein", "Adım"};
        int[] col = {WATER, PROT, STEP};
        double[] f = {w / wg, pr / pg, st / sg};
        String[] wd = {waterWord(w / wg), pr >= pg ? "Tamam ✓" : WidgetData.n0(pg - pr) + " g kaldı", st >= sg ? "Tamam ✓" : st / sg >= 0.8 ? "Hedefe yakın" : st > 0 ? "Yolda" : "Henüz yok"};
        int n = hs ? 3 : 2;
        if (!wide && low()) {
            textC("🌿", 24, 26, 14, fm, FG);
            text("BUGÜN", 38, 25, 9, fb, AC, W - 54, 1.3f);
            int fit = Math.max(1, Math.min(n, (int) ((H - 36) / 14)));
            float y = 44, step = Math.max(14, (H - 50) / fit);
            for (int i = 0; i < fit; i++) {
                text(nm[i] + " · " + wd[i], 16, y + 4, 10.5f, fb, FG, W - 32);
                y += step;
            }
            return;
        }
        if (!wide) {
            head("🌿", "BUGÜN", AC);
            float y = 58, step = Math.min(34, (H - 66) / n);
            for (int i = 0; i < n; i++) {
                textC(em[i], 26, y + 8, 15, fm, FG);
                text(wd[i], 42, y + 4, 11.5f, fb, FG, W - 58);
                bar(42, y + 10, W - 58, 5, (float) f[i], col[i], TRACK);
                y += step;
            }
            return;
        }
        headL("BUGÜN", 16, AC);
        textR(WidgetData.todayLong(d.now), W - 16, 26, 11, fm, MU);
        if (H < 150) {
            // alçak geniş: kutular yerine tek satır; düğmeler yalnızca sığarsa
            boolean btn = H >= 104;
            float cw = (W - 32) / n, y = btn ? 50 : Math.min(H / 2 + 8, 58);
            for (int i = 0; i < n; i++) {
                float x = 16 + i * cw;
                textC(em[i], x + 9, y + 1, 13, fm, FG);
                text(wd[i], x + 22, y, 10.5f, fb, FG, cw - 28);
                bar(x, y + 7, cw - 12, 4, (float) f[i], col[i], TRACK);
            }
            if (btn) buttons(r, new String[][]{{"💧 +1 bardak", "water/250"}, {"Kilo gir", "weight"}}, new int[]{BTN, SOFT}, new int[]{BTNF, FG});
            return;
        }
        float gap = 8, tw = (W - 32 - gap * (n - 1)) / n, ty = 38, th = H - ty - 56;
        for (int i = 0; i < n; i++) {
            float x = 16 + i * (tw + gap);
            rrect(x, ty, tw, th, 16, SOFT);
            textC(em[i], x + 18, ty + 24, 16, fm, FG);
            textR(nm[i], x + tw - 10, ty + 20, 12, db, FG);
            bar(x + 10, ty + th - 26, tw - 20, 5, (float) f[i], col[i], TRACK);
            text(wd[i], x + 10, ty + th - 9, 10.5f, fb, MU, tw - 20);
        }
        buttons(r, new String[][]{{"💧 +1 bardak", "water/250"}, {"Kilo gir", "weight"}}, new int[]{BTN, SOFT}, new int[]{BTNF, FG});
    }

    /** Kilo gidişi tek cümle: perWeek negatifse doğru yolda. */
    private String trendWord(JSONObject k) {
        if (k == null || !k.has("perWeek") || k.isNull("perWeek")) return "İlk adımlar";
        double pw = k.optDouble("perWeek");
        if (pw <= -0.1) return "Doğru yolda";
        if (pw >= 0.1) return "Biraz yükseldi";
        return "Yerinde sayıyor";
    }

    /** "hedefe Mart civarı": kalan kilo ve haftalık hızdan. */
    private String etaWord(JSONObject k, long now) {
        if (k == null || k.isNull("left") || k.isNull("perWeek")) return "";
        double left = k.optDouble("left"), pw = k.optDouble("perWeek");
        if (left <= 0) return "hedefindesin";
        if (pw > -0.05) return "";
        double weeks = left / -pw;
        if (weeks > 104) return "";
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTimeInMillis(now + (long) (weeks * 7 * 864e5));
        return "hedefe " + new java.text.SimpleDateFormat("MMMM", WidgetData.TR).format(cal.getTime()) + " civarı";
    }

    private void kilo(WidgetData d, Result r, boolean wide, boolean tall) {
        r.main = "weight";
        bg();
        JSONObject k = d.obj("w");
        if (k == null) { empty("📉", "İlk tartını gir", "dokun, kilonu ekle"); return; }
        String sub = WidgetData.sgn(k.optDouble("change")) + " kg başından";
        if (!tall) {
            float ic = Math.min(44, H - 24), y0 = (H - ic) / 2;
            rrect(14, y0, ic, ic, 14, SOFT);
            textC("📉", 14 + ic / 2, y0 + ic * 0.68f, ic * 0.5f, fm, FG);
            float x = 14 + ic + 12;
            float tw = text(WidgetData.n1(k.optDouble("cur")), x, H / 2 + 3, 22, db, FG, 110);
            text(" kg", x + tw, H / 2 + 3, 12, fm, MU, 40);
            text(sub, x, H / 2 + 19, 11, fm, MU, W - x - 56);
            float cx = W - 14 - 17, cy = H / 2;
            p.setColor(BTN);
            c.drawCircle(cx, cy, 17, p);
            textC("+", cx, cy + 7, 22, fb, BTNF);
            return;
        }
        if (wide) {
            headL("KİLO", 16, AC);
            float tw = text(WidgetData.n1(k.optDouble("cur")), 16, 70, 30, db, FG, 140);
            text(" kg", 16 + tw, 70, 13, fm, MU, 40);
            text(sub, 16, 90, 11.5f, fm, MU, 170);
            spark(k.optJSONArray("pts"), null, 200, 16, W - 216, H - 82, AC, false);
        } else {
            head("📉", "KİLO", AC);
            float tw = text(WidgetData.n1(k.optDouble("cur")), 16, H - 80, 28, db, FG, W - 60);
            text(" kg", 16 + tw, H - 80, 13, fm, MU, 40);
            text(sub, 16, H - 62, 11.5f, fm, MU, W - 32);
        }
        buttons(r, new String[][]{{"+ Kilo gir", "weight"}}, new int[]{BTN}, new int[]{BTNF});
    }

    private void grafik(WidgetData d, Result r, boolean wide) {
        r.main = "tab/kilo";
        bg();
        JSONObject k = d.obj("w");
        if (k == null || k.optJSONArray("pts") == null || k.optJSONArray("pts").length() < 2) {
            empty("📉", "Grafik için 2 tartı", "tartıların geldikçe çizilir");
            return;
        }
        String eta = etaWord(k, d.now);
        if (!wide && low()) { compact("📉", "KİLO", AC, trendWord(k), eta.isEmpty() ? "son 30 gün" : eta, -1, AC); return; }
        if (!wide) {
            head("📉", "KİLO", AC);
            spark(k.optJSONArray("pts"), null, 16, 52, W - 32, H - 112, AC, false);
            text(trendWord(k), 16, H - 34, 20, db, FG, W - 32);
            text(eta.isEmpty() ? "son 30 gün" : eta, 16, H - 16, 11.5f, fm, MU, W - 32);
            return;
        }
        headL("KİLO · SON 30 GÜN", 16, AC);
        text(trendWord(k), 16, 62, 24, db, FG, 150);
        text(WidgetData.sgn(k.optDouble("d30")) + " kg bu ay", 16, 82, 11.5f, fm, MU, 150);
        if (!eta.isEmpty()) chip("📍 " + eta, 16, H - 38, 11, SOFT, FG, 150);
        spark(k.optJSONArray("pts"), k.optJSONArray("shots"), 176, 18, W - 192, H - 34, AC, true);
    }

    private void hedef(WidgetData d, Result r, boolean wide) {
        r.main = "tab/basari";
        bg();
        JSONObject k = d.obj("w");
        if (k == null || !k.has("pct") || k.isNull("pct")) {
            empty("🎯", "Hedef kilonu belirle", "Ayarlar'dan ekleyebilirsin");
            r.main = "tab/ayar";
            return;
        }
        float pct = (float) Math.max(0, Math.min(100, k.optDouble("pct")));
        double left = Math.max(0, k.optDouble("left"));
        String big = left <= 0.05 ? "Hedefindesin" : WidgetData.n1(left) + " kg kaldı";
        String sub = "hedef " + WidgetData.n0(k.optDouble("goal")) + " kg";
        if (!wide && low()) { compact("🎯", "HEDEF", AC, big, sub, pct / 100f, AC); return; }
        if (!wide) {
            head("🎯", "HEDEF", AC);
            text(big, 16, H - 50, big.length() > 11 ? 20 : 24, db, FG, W - 32);
            text(sub, 16, H - 32, 11.5f, fm, MU, W - 32);
            bar(16, H - 22, W - 32, 6, pct / 100f, AC, TRACK);
            return;
        }
        headL("HEDEFE İLERLEME", 16, AC);
        textR("🎯", W - 16, 34, 24, fm, FG);
        text(big, 16, 70, 28, db, FG, W - 32);
        text(sub + " · yolun %" + Math.round(pct) + "'i", 16, 90, 11.5f, fm, MU, W - 32);
        bar(16, 100, W - 32, 6, pct / 100f, AC, TRACK);
        JSONObject b = d.obj("badge");
        if (b != null && H >= 150) {
            rrect(16, H - 48, W - 32, 34, 14, SOFT);
            textC("🏅", 34, H - 25, 15, fm, FG);
            text("Sıradaki rozet: " + b.optString("t") + " · " + WidgetData.n1(b.optDouble("left")) + " kg", 50, H - 26, 11.5f, fb, FG, W - 80);
        }
    }

    private void su(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg();
        double w = d.water(), g = d.waterGoal();
        float f = (float) Math.min(1, w / g);
        int cups = (int) Math.ceil(Math.max(0, g - w) / 250.0);
        String big = cups == 0 ? "Tamam" : cups + " bardak", sub = cups == 0 ? "bugünkü su hedefi" : "daha, hedefe";
        if (!wide && low()) {
            boolean btn = H >= 100;
            textC("💧", 24, 26, 14, fm, FG);
            text("SU", 38, 25, 9, fb, AC, W - 54, 1.3f);
            text(cups == 0 ? "Tamam" : big + " daha", 16, btn ? 50 : Math.min(H - 22, 56), 20, db, FG, W - 32);
            if (btn) buttons(r, new String[][]{{"+1 bardak", "water/250"}}, new int[]{BTN}, new int[]{BTNF});
            else bar(16, H - 16, W - 32, 5, f, WATER, TRACK);
            return;
        }
        if (!wide) {
            textC("💧", 28, 36, 24, fm, FG);
            glass(W - 16 - 26, 14, 26, 38, f);
            text(big, 16, H - 80, 26, db, FG, W - 32);
            text(sub, 16, H - 62, 11.5f, fm, MU, W - 32);
            buttons(r, new String[][]{{"+1 bardak", "water/250"}}, new int[]{BTN}, new int[]{BTNF});
            return;
        }
        float gh = H - 32, gw = gh * 0.62f;
        glass(18, 16, gw, gh, f);
        float x = 18 + gw + 20, mw = W - x - 16;
        headL("SU", x, AC);
        boolean lo = H < 140;
        text(cups == 0 ? "Bugün tamam" : big + " daha", x, lo ? 54 : 66, lo ? 20 : 26, db, FG, mw);
        if (!lo) bar(x, 78, mw, 6, f, WATER, TRACK);
        buttonsAt(r, x, new String[][]{{"+1 bardak", "water/250"}, {"+2 bardak", "water/500"}}, new int[]{BTN, SOFT}, new int[]{BTNF, FG});
    }

    private void protein(WidgetData d, Result r, boolean wide) {
        r.main = "protein";
        bg();
        double pr = d.protein(), g = d.proteinGoal();
        JSONArray cols = d.fresh && d.day() != null ? d.day().optJSONArray("pc") : null;
        int of = (int) Math.max(12, Math.ceil(g / 5));
        String big = pr >= g ? "Tamam ✓" : WidgetData.n0(g - pr) + " g kaldı";
        if (!wide && low()) { compact("🍳", "PROTEİN", night ? 0xFFE8B062 : 0xFFB06D10, big, null, (float) (pr / g), PROT); return; }
        if (!wide) {
            head("🍳", "PROTEİN", night ? 0xFFE8B062 : 0xFFB06D10);
            text(big, 16, 76, 22, db, FG, W - 32);
            blocks(cols, of, 16, 88, W - 32, H - 102, 8);
            return;
        }
        headL("PROTEİN", 16, night ? 0xFFE8B062 : 0xFFB06D10);
        text(big, 16, 62, 24, db, FG, 150);
        blocks(cols, of, 176, 18, W - 192, 64, 11);
        JSONArray foods = d.fresh && d.day() != null ? d.day().optJSONArray("foods") : null;
        float x = 16;
        if (foods != null && H >= 110) for (int i = 0; i < foods.length() && i < 3; i++) {
            float cw = chip(foods.optString(i), x, H - 38, 11, SOFT, FG, W - x - 80);
            x += cw + 6;
            if (x > W - 130) break;
        }
        if (H >= 110) chip("+ Ekle", Math.min(x, W - 72), H - 38, 11, BTN, BTNF, 64);
    }

    private void adim(WidgetData d, Result r, boolean wide) {
        r.main = "tab/adim";
        bg();
        if (!d.hasSteps()) { empty("👟", "Adımlarını bağla", "Health Connect ile"); return; }
        double st = d.steps(), g = d.stepGoal();
        String big = WidgetData.n0(st), sub = st >= g ? "bugünkü hedef tamam" : WidgetData.n0(g - st) + " adım kaldı";
        if (!wide && low()) { compact("👟", "ADIM", AC, big, sub, (float) (st / g), STEP); return; }
        if (!wide) {
            head("👟", "ADIM", AC);
            text(big, 16, H - 50, 28, db, FG, W - 32);
            text(sub, 16, H - 32, 11.5f, fm, MU, W - 32);
            bar(16, H - 22, W - 32, 6, (float) (st / g), STEP, TRACK);
            return;
        }
        headL("ADIM", 16, AC);
        text(big, 16, 66, 28, db, FG, 150);
        text(sub, 16, 86, 11.5f, fm, MU, 150);
        JSONObject day = d.day();
        JSONArray wk = day != null ? day.optJSONArray("wk") : null;
        if (wk != null && wk.length() > 0) {
            int n = wk.length();
            float x = 176, mw = W - x - 16, bw = mw / n, top = 18, bh = H - top - 34;
            double mx = g;
            for (int i = 0; i < n; i++) mx = Math.max(mx, wk.optDouble(i));
            for (int i = 0; i < n; i++) {
                double v = (i == n - 1 && !d.fresh) ? 0 : wk.optDouble(i);
                float h = (float) Math.max(4, v / mx * bh);
                rrect(x + i * bw + bw * 0.22f, top + bh - h, bw * 0.56f, h, 5, v >= g ? STEP : (STEP & 0x00FFFFFF) | 0x55000000);
            }
            JSONArray lb = day.optJSONArray("wkl");
            if (lb != null) for (int i = 0; i < n && i < lb.length(); i++)
                textC(lb.optString(i), x + i * bw + bw / 2, H - 14, 9.5f, fm, MU);
        }
    }

    private void takviye(WidgetData d, Result r, boolean wide) {
        r.main = "tab/takviye";
        bg();
        JSONArray days = d.o.optJSONArray("supp");
        JSONArray slots = null;
        if (days != null) for (int i = 0; i < days.length(); i++) {
            JSONObject x = days.optJSONObject(i);
            if (x != null && d.today.equals(x.optString("d"))) { slots = x.optJSONArray("s"); break; }
        }
        if (slots == null || slots.length() == 0) { empty("💊", "Bugün takviye yok", "programını Hafif'te kur"); return; }
        int done = 0, of = 0;
        JSONObject nx = null;
        boolean useLog = d.fresh;
        for (int i = 0; i < slots.length(); i++) {
            JSONObject sl = slots.optJSONObject(i);
            int dn = useLog ? sl.optInt("done") : 0;
            done += dn;
            of += sl.optInt("of");
            if (nx == null && dn < sl.optInt("of")) nx = sl;
        }
        int pink = night ? 0xFFF2A9C4 : 0xFFB8577A;
        if (!wide && low()) {
            compact("💊", "TAKVİYE", pink, nx == null ? "Hepsi alındı ✓" : nx.optString("n") + " · " + nx.optString("t"), nx == null ? "bugün " + done + "/" + of : nx.optString("names"), of == 0 ? -1 : (float) done / of, pink);
            return;
        }
        if (!wide) {
            head("💊", nx == null ? "TAKVİYE" : nx.optString("n").toUpperCase(WidgetData.TR) + " · " + nx.optString("t"), pink);
            if (nx == null) {
                text("Hepsi alındı ✓", 16, H - 44, 20, db, FG, W - 32);
                text("bugün " + done + "/" + of, 16, H - 26, 11.5f, fm, MU, W - 32);
                return;
            }
            wrap(nx.optString("names").replace(" · ", ", "), 16, 76, W - 32, 17, db, FG, 2);
            buttons(r, new String[][]{{"Hepsini aldım", "supp/" + nx.optString("k")}}, new int[]{BTN}, new int[]{BTNF});
            return;
        }
        headL("TAKVİYELER", 16, pink);
        chipR("Bugün " + done + "/" + of, W - 16, 12, 11, SOFT, FG);
        int ni = 0;
        for (int i = 0; i < slots.length(); i++) if (slots.optJSONObject(i) == nx) { ni = i; break; }
        int a = Math.max(0, Math.min(ni - (nx == null ? 0 : 1), slots.length() - 2));
        if (H < 150) {
            text(nx == null ? "Hepsi alındı ✓" : nx.optString("e") + " " + nx.optString("n") + " · " + nx.optString("t"), 16, 60, 16, db, FG, W - 32);
            if (nx != null) text(nx.optString("names"), 16, 78, 11, fm, MU, W - 32);
            if (nx != null && H >= 120) buttons(r, new String[][]{{nx.optString("n") + " takviyelerini aldım", "supp/" + nx.optString("k")}}, new int[]{BTN}, new int[]{BTNF});
            return;
        }
        int cnt = Math.min(2, slots.length());
        float cw = (W - 32 - 8 * (cnt - 1)) / cnt;
        for (int j = 0; j < cnt; j++) {
            JSONObject sl = slots.optJSONObject(a + j);
            float x = 16 + j * (cw + 8);
            rrect(x, 40, cw, 62, 16, SOFT);
            text(sl.optString("e") + " " + sl.optString("n") + " · " + sl.optString("t"), x + 12, 59, 11.5f, fb, FG, cw - 24);
            text(sl.optString("names"), x + 12, 75, 11, fm, MU, cw - 24);
            boolean ok = useLog && sl.optInt("done") >= sl.optInt("of");
            text(ok ? "✓ alındı" : "bekliyor", x + 12, 92, 11, fb, ok ? AC : pink, cw - 24);
        }
        if (nx != null)
            buttons(r, new String[][]{{nx.optString("n") + " takviyelerini aldım", "supp/" + nx.optString("k")}}, new int[]{BTN}, new int[]{BTNF});
    }

    /** Ne yesem?: saate göre öğün önerisi; + Ekle proteini uygulamada ekler. */
    private void yemek(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg();
        JSONObject ms = d.obj("meals");
        double rem = d.proteinGoal() - d.protein();
        if (ms == null) { empty("🍲", "Hafif'i bir kez aç", "öneriler hazırlansın"); return; }
        if (rem < 10) { empty("🍳", "Bugünkü protein tamam", "yarın yeni önerilerle"); return; }
        int h = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY);
        String slot = h < 11 ? "k" : h >= 21 ? "a" : "o";
        String lbl = slot.equals("k") ? "KAHVALTI" : slot.equals("a") ? "HAFİF BİR ŞEY" : h < 16 ? "ÖĞLE" : "AKŞAM";
        JSONArray L = ms.optJSONArray(slot);
        JSONObject m = L == null || L.length() == 0 ? null : L.optJSONObject(0);
        if (m == null) { empty("🍲", "Öneri yok", "Hafif'i açınca yenilenir"); return; }
        String remT = WidgetData.n0(rem) + " g protein kaldı";
        int gold = night ? 0xFFE8B062 : 0xFFB06D10;
        String act = "meal/" + m.optString("id");
        if (!wide && low()) { compact(m.optString("e", "🍲"), "NE YESEM?", gold, m.optString("s"), "+" + m.optInt("g") + " g protein", -1, gold); return; }
        if (!wide) {
            head(m.optString("e", "🍲"), "NE YESEM?", gold);
            wrap(m.optString("s"), 16, 72, W - 32, 19, db, FG, 2);
            text("+" + m.optInt("g") + " g protein", 16, H - 56, 11.5f, fb, gold, W - 32);
            buttons(r, new String[][]{{"+ Ekle", act}}, new int[]{BTN}, new int[]{BTNF});
            return;
        }
        float pd = H - 28, px = 16, py = 14;
        p.setShader(null);
        p.setStyle(Paint.Style.FILL);
        p.setColor(night ? 0xFF1E3B35 : 0xFFEFE8DC);
        c.drawCircle(px + pd / 2, py + pd / 2, pd / 2, p);
        p.setColor(night ? 0xFF2A4A43 : WHITE);
        c.drawCircle(px + pd / 2, py + pd / 2, pd / 2 - 7, p);
        textC(m.optString("e", "🍲"), px + pd * 0.42f, py + pd * 0.52f, pd * 0.34f, fm, FG);
        textC(m.optString("e2", "🥗"), px + pd * 0.66f, py + pd * 0.74f, pd * 0.26f, fm, FG);
        float x = px + pd + 18, mw = W - x - 16;
        text("NE YESEM? · " + lbl, x, 28, 9.5f, fb, gold, mw, 1.3f);
        if (H < 140) text(m.optString("n"), x, 54, 16, db, FG, mw);
        else {
            wrap(m.optString("n"), x, 56, mw, 18, db, FG, 2);
            text(remT, x, 96, 11.5f, fm, MU, mw);
        }
        buttonsAt(r, x, new String[][]{{"+ Ekle · " + m.optInt("g") + " g", act}, {"Başka öner", "tab/besin"}}, new int[]{BTN, SOFT}, new int[]{BTNF, FG});
    }

    // ---------- Plus kilidi ----------
    private Bitmap locked(Bitmap src, float s) {
        int bw = Math.max(1, src.getWidth() / 10), bh = Math.max(1, src.getHeight() / 10);
        Bitmap small = Bitmap.createScaledBitmap(src, bw, bh, true);
        Bitmap blur = Bitmap.createScaledBitmap(small, src.getWidth(), src.getHeight(), true);
        Bitmap out = Bitmap.createBitmap(src.getWidth(), src.getHeight(), Bitmap.Config.ARGB_8888);
        c = new Canvas(out);
        c.scale(s, s);
        bg();
        Paint ip = new Paint(Paint.FILTER_BITMAP_FLAG);
        ip.setAlpha(90);
        c.save();
        c.scale(1 / s, 1 / s);
        c.drawBitmap(blur, 0, 0, ip);
        c.restore();
        float cy = H / 2;
        center("✦ HAFİF PLUS", cy - 14, 10.5f, fb, AC, 1.3f);
        center("Widget'lar Plus'ta", cy + 5, 13, db, FG);
        float bw2 = 72, bx = W / 2 - bw2 / 2;
        rrect(bx, cy + 15, bw2, 26, 13, BTN);
        textC("Aç", W / 2, cy + 32.5f, 12, fb, BTNF);
        return out;
    }

    // ---------- çizim yardımcıları ----------
    private void bg() {
        dark = night;
        p.setShader(null);
        p.setStyle(Paint.Style.FILL);
        p.setColor(BG);
        c.drawRoundRect(new RectF(0, 0, W, H), 24, 24, p);
    }

    private void rrect(float x, float y, float w, float h, float rad, int col) {
        p.setShader(null);
        p.setStyle(Paint.Style.FILL);
        p.setColor(col);
        c.drawRoundRect(new RectF(x, y, x + w, y + h), rad, rad, p);
    }

    private void ring(float cx, float cy, float r, float st, float f, int col, int track) {
        f = Math.max(0, Math.min(1, f));
        p.setShader(null);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(st);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(track);
        c.drawCircle(cx, cy, r, p);
        if (f > 0.005f) {
            p.setColor(col);
            c.drawArc(new RectF(cx - r, cy - r, cx + r, cy + r), -90, 360 * f, false, p);
        }
        p.setStyle(Paint.Style.FILL);
    }

    private void bar(float x, float y, float w, float h, float f, int col, int track) {
        f = Math.max(0, Math.min(1, f));
        rrect(x, y, w, h, h / 2, track);
        if (f > 0.01f) rrect(x, y, Math.max(h, w * f), h, h / 2, col);
    }

    private float text(String s, float x, float y, float size, Typeface tf, int col, float maxW) {
        return text(s, x, y, size, tf, col, maxW, 0);
    }

    private float text(String s, float x, float y, float size, Typeface tf, int col, float maxW, float spacingEm) {
        if (s == null) return 0;
        tp.setTypeface(tf);
        tp.setTextSize(size);
        tp.setColor(col);
        tp.setLetterSpacing(spacingEm > 0 ? spacingEm / 10f : 0);
        tp.setTextAlign(Paint.Align.LEFT);
        CharSequence t = maxW > 0 ? TextUtils.ellipsize(s, tp, maxW, TextUtils.TruncateAt.END) : s;
        c.drawText(t, 0, t.length(), x, y, tp);
        return tp.measureText(t, 0, t.length());
    }

    private void textR(String s, float x, float y, float size, Typeface tf, int col) {
        tp.setTypeface(tf);
        tp.setTextSize(size);
        tp.setColor(col);
        tp.setLetterSpacing(0);
        tp.setTextAlign(Paint.Align.RIGHT);
        c.drawText(s, x, y, tp);
        tp.setTextAlign(Paint.Align.LEFT);
    }

    private void textC(String s, float x, float y, float size, Typeface tf, int col) {
        textC(s, x, y, size, tf, col, 0);
    }

    private void textC(String s, float x, float y, float size, Typeface tf, int col, float spacingEm) {
        tp.setTypeface(tf);
        tp.setTextSize(size);
        tp.setColor(col);
        tp.setLetterSpacing(spacingEm > 0 ? spacingEm / 10f : 0);
        tp.setTextAlign(Paint.Align.CENTER);
        CharSequence t = TextUtils.ellipsize(s, tp, W - 20, TextUtils.TruncateAt.END);
        c.drawText(t, 0, t.length(), x, y, tp);
        tp.setTextAlign(Paint.Align.LEFT);
        tp.setLetterSpacing(0);
    }

    private void center(String s, float y, float size, Typeface tf, int col) { textC(s, W / 2, y, size, tf, col); }

    private void center(String s, float y, float size, Typeface tf, int col, float sp) { textC(s, W / 2, y, size, tf, col, sp); }

    private void wrap(String s, float x, float y, float maxW, float size, Typeface tf, int col, int maxLines) {
        if (s == null) return;
        tp.setTypeface(tf);
        tp.setTextSize(size);
        tp.setColor(col);
        tp.setLetterSpacing(0);
        String[] words = s.split(" ");
        StringBuilder line = new StringBuilder();
        int n = 0;
        float lh = size * 1.35f;
        for (int i = 0; i < words.length; i++) {
            String tryS = line.length() == 0 ? words[i] : line + " " + words[i];
            if (tp.measureText(tryS) > maxW && line.length() > 0) {
                if (n == maxLines - 1) {
                    StringBuilder rest = new StringBuilder(line);
                    for (int j = i; j < words.length; j++) rest.append(' ').append(words[j]);
                    CharSequence t = TextUtils.ellipsize(rest, tp, maxW, TextUtils.TruncateAt.END);
                    c.drawText(t, 0, t.length(), x, y + n * lh, tp);
                    return;
                }
                c.drawText(line.toString(), x, y + n * lh, tp);
                n++;
                line = new StringBuilder(words[i]);
            } else line = new StringBuilder(tryS);
        }
        if (line.length() > 0) c.drawText(line.toString(), x, y + n * lh, tp);
    }

    private float chip(String s, float x, float y, float size, int bgc, int fg, float maxW) {
        tp.setTypeface(fb);
        tp.setTextSize(size);
        tp.setLetterSpacing(0);
        CharSequence t = TextUtils.ellipsize(s, tp, Math.max(20, maxW - 18), TextUtils.TruncateAt.END);
        float w = tp.measureText(t, 0, t.length()) + 18, h = size + 11;
        rrect(x, y, w, h, h / 2, bgc);
        tp.setColor(fg);
        c.drawText(t, 0, t.length(), x + 9, y + h / 2 + size * 0.36f, tp);
        return w;
    }

    private void chipR(String s, float right, float y, float size, int bgc, int fg) {
        tp.setTypeface(fb);
        tp.setTextSize(size);
        float w = tp.measureText(s) + 18;
        chip(s, right - w, y, size, bgc, fg, w + 4);
    }

    private void leaf(float x, float y, int col) {
        Path leaf = new Path();
        float sc = 12 / 24f, ox = x, oy = y - 11;
        leaf.moveTo(ox + 20 * sc, oy + 4 * sc);
        leaf.cubicTo(ox + 11 * sc, oy + 4 * sc, ox + 5 * sc, oy + 9 * sc, ox + 5 * sc, oy + 17 * sc);
        leaf.lineTo(ox + 5 * sc, oy + 20 * sc);
        leaf.moveTo(ox + 20 * sc, oy + 4 * sc);
        leaf.cubicTo(ox + 20 * sc, oy + 13 * sc, ox + 15 * sc, oy + 18 * sc, ox + 7 * sc, oy + 18 * sc);
        p.setShader(null);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(1.7f);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(col);
        c.drawPath(leaf, p);
        p.setStyle(Paint.Style.FILL);
    }

    private void textRs(String s, float x, float y, float size, Typeface tf, int col, float spacingEm) {
        tp.setTypeface(tf);
        tp.setTextSize(size);
        tp.setColor(col);
        tp.setLetterSpacing(spacingEm / 10f);
        tp.setTextAlign(Paint.Align.RIGHT);
        CharSequence t = TextUtils.ellipsize(s, tp, W - 64, TextUtils.TruncateAt.END);
        c.drawText(t, 0, t.length(), x, y, tp);
        tp.setTextAlign(Paint.Align.LEFT);
        tp.setLetterSpacing(0);
    }

    private void syringe(float cx, float cy, float sz, int col) {
        p.setShader(null);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(sz * 0.11f);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(col);
        c.save();
        c.rotate(-45, cx, cy);
        c.drawRect(cx - sz * 0.42f, cy - sz * 0.16f, cx + sz * 0.22f, cy + sz * 0.16f, p);
        c.drawLine(cx + sz * 0.22f, cy, cx + sz * 0.52f, cy, p);
        c.drawLine(cx - sz * 0.42f, cy, cx - sz * 0.6f, cy, p);
        c.drawLine(cx - sz * 0.6f, cy - sz * 0.2f, cx - sz * 0.6f, cy + sz * 0.2f, p);
        c.restore();
        p.setStyle(Paint.Style.FILL);
    }

    private void glass(float x, float y, float w, float h, float f) {
        Path g = new Path();
        g.moveTo(x, y);
        g.lineTo(x + w, y);
        g.lineTo(x + w * 0.9f, y + h);
        g.lineTo(x + w * 0.1f, y + h);
        g.close();
        p.setShader(null);
        p.setStyle(Paint.Style.FILL);
        p.setColor(night ? 0x1AFFFFFF : 0xFFEAF5FB);
        c.drawPath(g, p);
        c.save();
        c.clipPath(g);
        float wy = y + h * (1 - Math.max(0, Math.min(1, f)));
        p.setColor(WATER);
        c.drawRect(x, wy, x + w, y + h, p);
        p.setColor(0xFF8FD6F8);
        c.drawRect(x, wy, x + w, wy + 3, p);
        c.restore();
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(1.6f);
        p.setColor(night ? 0x66FFFFFF : 0xFF9CC9E2);
        c.drawPath(g, p);
        p.setStyle(Paint.Style.FILL);
    }

    private void blocks(JSONArray cols, int of, float x, float y, float w, float h, int perRow) {
        int rows = (int) Math.ceil(of / (double) perRow);
        float gap = 3, sz = Math.min((w - gap * (perRow - 1)) / perRow, (h - gap * (rows - 1)) / rows);
        for (int i = 0; i < of; i++) {
            int col = cols != null && i < cols.length() ? parse(cols.optString(i)) : TRACK;
            rrect(x + (i % perRow) * (sz + gap), y + (i / perRow) * (sz + gap), sz, sz, Math.min(4, sz / 3), col);
        }
    }

    private static int parse(String hex) {
        try { return 0xFF000000 | Integer.parseInt(hex.replace("#", ""), 16); } catch (Exception e) { return 0xFFE6B35A; }
    }

    /** pts: [[gün, kg],...] gün 0-30; shots: [gün,...] */
    private void spark(JSONArray pts, JSONArray shots, float x, float y, float w, float h, int col, boolean shotLines) {
        if (pts == null || pts.length() < 2) return;
        double mn = 1e9, mx = -1e9, d0 = 1e9, d1 = -1e9;
        for (int i = 0; i < pts.length(); i++) {
            JSONArray q = pts.optJSONArray(i);
            mn = Math.min(mn, q.optDouble(1)); mx = Math.max(mx, q.optDouble(1));
            d0 = Math.min(d0, q.optDouble(0)); d1 = Math.max(d1, q.optDouble(0));
        }
        mn -= 0.3; mx += 0.3;
        boolean byIndex = d1 - d0 < 1; // hepsi aynı gün: eşit aralıklı çiz
        if (byIndex) { d0 = 0; d1 = pts.length() - 1; }
        double span = Math.max(1, d1 - d0);
        if (shotLines && shots != null) {
            p.setStyle(Paint.Style.STROKE);
            p.setStrokeWidth(1.2f);
            p.setColor(0x803552B0);
            p.setPathEffect(new android.graphics.DashPathEffect(new float[]{3, 3}, 0));
            for (int i = 0; i < shots.length(); i++) {
                double sd = shots.optDouble(i);
                if (byIndex || sd < d0 || sd > d1) continue;
                float sx = x + (float) ((sd - d0) / span) * w;
                c.drawLine(sx, y, sx, y + h, p);
            }
            p.setPathEffect(null);
        }
        Path line = new Path(), area = new Path();
        for (int i = 0; i < pts.length(); i++) {
            JSONArray q = pts.optJSONArray(i);
            float px = x + (float) (((byIndex ? i : q.optDouble(0)) - d0) / span) * w;
            float py = y + 4 + (float) ((mx - q.optDouble(1)) / (mx - mn)) * (h - 8);
            if (i == 0) { line.moveTo(px, py); area.moveTo(px, y + h); area.lineTo(px, py); }
            else { line.lineTo(px, py); area.lineTo(px, py); }
            if (i == pts.length() - 1) area.lineTo(px, y + h);
        }
        area.close();
        p.setStyle(Paint.Style.FILL);
        p.setColor((col & 0x00FFFFFF) | 0x1F000000);
        c.drawPath(area, p);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(2.4f);
        p.setStrokeJoin(Paint.Join.ROUND);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(col);
        c.drawPath(line, p);
        p.setStyle(Paint.Style.FILL);
    }

    /** Alt düğmeler: tüm genişlik, 14dp kenar ve alt boşluk, 32dp yükseklik. */
    private void buttons(Result r, String[][] b, int[] bgc, int[] fg) { buttonsAt(r, 14, b, bgc, fg); }

    private void buttonsAt(Result r, float x0, String[][] b, int[] bgc, int[] fg) {
        float y = H - 14 - 32, gap = 8, w = (W - x0 - 14 - gap * (b.length - 1)) / b.length;
        for (int i = 0; i < b.length; i++) {
            float x = x0 + i * (w + gap);
            rrect(x, y, w, 32, 16, bgc[i]);
            tp.setTypeface(fb);
            tp.setTextSize(12);
            tp.setLetterSpacing(0);
            CharSequence t = TextUtils.ellipsize(b[i][0], tp, w - 12, TextUtils.TruncateAt.END);
            tp.setColor(fg[i]);
            tp.setTextAlign(Paint.Align.CENTER);
            c.drawText(t, 0, t.length(), x + w / 2, y + 20.5f, tp);
            tp.setTextAlign(Paint.Align.LEFT);
            r.buttons.add(b[i]);
        }
        r.buttonsLeft = x0;
    }
}
