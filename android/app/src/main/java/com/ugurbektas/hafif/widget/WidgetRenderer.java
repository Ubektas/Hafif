package com.ugurbektas.hafif.widget;

import android.content.Context;
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
            WATER = 0xFF5BC0F5, PROT = 0xFFE6B35A, STEP = 0xFF8C9BF0, SHOT = 0xFFF4A586, SUPP = 0xFFD6CBF7, GOLD = 0xFFE8C877;

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

    WidgetRenderer(Context ctx) {
        Typeface a = null, b = null, d = null;
        try {
            a = ResourcesCompat.getFont(ctx, R.font.hafif_figtree_medium);
            b = ResourcesCompat.getFont(ctx, R.font.hafif_figtree_bold);
            d = ResourcesCompat.getFont(ctx, R.font.hafif_bricolage_bold);
        } catch (Exception ignored) {
        }
        fm = a != null ? a : Typeface.DEFAULT;
        fb = b != null ? b : Typeface.DEFAULT_BOLD;
        db = d != null ? d : Typeface.DEFAULT_BOLD;
    }

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
            bg(true);
            logo(14, 22, "Hafif", MINT);
            center("Hafif'i bir kez aç", H / 2, 15, fb, WHITE);
            center("widget verileri hazırlansın", H / 2 + 18, 11.5f, fm, 0xB3FFFFFF);
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

    // ---------- 10 widget ----------
    private void draw(int k, WidgetData d, Result r) {
        boolean wide = W >= 230, tall = H >= 130;
        switch (k) {
            case 1: dongu(d, r, wide); break;
            case 2: siradaki(d, r, wide, tall); break;
            case 3: bugun(d, r, wide); break;
            case 4: kilo(d, r, wide); break;
            case 5: grafik(d, r, wide); break;
            case 6: hedef(d, r, wide); break;
            case 7: su(d, r, wide); break;
            case 8: protein(d, r, wide); break;
            case 9: adim(d, r, wide); break;
            default: takviye(d, r, wide); break;
        }
    }

    private boolean noShots(WidgetData d, Result r) {
        if (d.shots() && d.cyc() != null) return false;
        bg(true);
        logo(14, 22, "Hafif", MINT);
        center(d.shots() ? "Henüz iğne yok" : "İğne takibi kapalı", H / 2, 15, fb, WHITE);
        center(d.shots() ? "İlk iğneni Hafif'e ekle" : "Ayarlar'dan açabilirsin", H / 2 + 18, 11.5f, fm, 0xB3FFFFFF);
        r.main = d.shots() ? "shot" : "tab/ayar";
        return true;
    }

    private void dongu(WidgetData d, Result r, boolean wide) {
        r.main = "tab/ozet";
        if (noShots(d, r)) return;
        bg(true);
        String ph = d.phaseName(), mg = WidgetData.n1(d.mg());
        if (!wide) {
            logo(14, 22, "Hafif", WHITE);
            float rr = Math.min(W, H) * 0.3f, cy = H * 0.5f + 2;
            ring(W / 2, cy, rr, Math.max(7, rr * 0.17f), d.cycleFrac(), MINT, 0x1FFFFFFF);
            center("YENİ İĞNE", cy - rr * 0.32f, 8.5f, fb, 0xB3FFFFFF, 1.2f);
            center(d.leftText(), cy + rr * 0.22f, rr * 0.42f, db, WHITE);
            textC(ph + "  ·  " + mg + " mg", W / 2, H - 14, 12.5f, fb, WHITE);
        } else {
            float rr = (H - 30) / 2, cx = 16 + rr, cy = H / 2;
            ring(cx, cy, rr, Math.max(8, rr * 0.16f), d.cycleFrac(), MINT, 0x1FFFFFFF);
            textC("VÜCUTTA", cx, cy - rr * 0.34f, 8.5f, fb, 0xB3FFFFFF, 1.2f);
            textC(mg, cx, cy + rr * 0.18f, rr * 0.4f, db, WHITE);
            textC("mg", cx, cy + rr * 0.45f, 10.5f, fm, 0xB3FFFFFF);
            float x = cx + rr + 18, mw = W - x - 14;
            logo(x, 24, "Hafif", WHITE);
            text(ph + " · " + d.cycleDay() + "/" + d.cycleDays(), x, 50, 18, db, WHITE, mw);
            wrap(d.phaseTip(), x, 68, mw, 11.5f, fm, 0xC0FFFFFF, 2);
            chip("Yeni iğne · " + d.leftText() + " · " + d.nextWhen(), x, H - 34, 11, 0x1FFFFFFF, WHITE, mw);
        }
    }

    private void siradaki(WidgetData d, Result r, boolean wide, boolean tall) {
        r.main = "shot";
        if (noShots(d, r)) return;
        bg(true);
        JSONObject n = d.next();
        if (!wide || !tall) {
            float ic = Math.min(40, H - 24), y0 = (H - ic) / 2;
            rrect(14, y0, ic, ic, 12, 0x40E2643D);
            syringe(14 + ic / 2, y0 + ic / 2, ic * 0.5f, SHOT);
            float x = 14 + ic + 12;
            text("YENİ İĞNE", x, H / 2 - 10, 8.5f, fb, 0xB3FFFFFF, W - x - 10, 1.2f);
            text(d.leftText(), x, H / 2 + 8, 19, db, WHITE, W - x - 10);
            text(d.nextWhen() + (wide && n != null ? "   ·   " + n.optString("dose", "") + " mg · " + n.optString("site", "") : ""), x, H / 2 + 24, 11, fm, 0xC0FFFFFF, W - x - 10);
            return;
        }
        logo(14, 24, "Hafif", WHITE);
        textR(d.nextWhenLong(), W - 14, 24, 11.5f, fm, 0xB3FFFFFF);
        text("YENİ İĞNE", 14, 54, 8.5f, fb, 0xB3FFFFFF, 120, 1.2f);
        text(d.leftText(), 14, 84, 30, db, WHITE, 130);
        float x = 150, mw = W - x - 14;
        String dose = n == null ? "" : n.optString("dose", "");
        String drug = n == null ? "" : n.optString("drug", "");
        text("💊  " + (dose.isEmpty() ? "–" : dose + " mg") + (drug.isEmpty() ? "" : " · " + drug), x, 56, 12.5f, fm, WHITE, mw);
        text("📍  Önerilen: " + (n == null ? "–" : n.optString("site", "–")), x, 76, 12.5f, fm, WHITE, mw);
        if (n != null && n.has("pen") && !n.isNull("pen")) {
            int pen = n.optInt("pen");
            text("🖊️  Kalemde " + pen + " doz kaldı", x, 96, 12.5f, fm, pen <= 1 ? SHOT : WHITE, mw);
        }
        buttons(r, new String[][]{{"İğneyi kaydet", "shot"}}, new int[]{0x4DE2643D}, new int[]{0xFFFFD2C2});
    }

    private void bugun(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg(true);
        double w = d.water(), wg = d.waterGoal(), pr = d.protein(), pg = d.proteinGoal(), st = d.steps(), sg = d.stepGoal();
        boolean hs = d.hasSteps();
        if (!wide) {
            logo(14, 22, "Bugün", WHITE);
            int n = hs ? 3 : 2;
            float gap = (W - 28) / n, rr = Math.min(gap * 0.36f, (H - 70) / 2f);
            float cy = H - 30 - rr;
            String[] lb = {WidgetData.n1(w / 1000) + " L", WidgetData.n0(pr) + " g", WidgetData.n0(st)};
            int[] col = {WATER, PROT, STEP};
            String[] em = {"💧", "🥚", "👣"};
            double[] f = {w / wg, pr / pg, st / sg};
            for (int i = 0; i < n; i++) {
                float cx = 14 + gap * i + gap / 2;
                ring(cx, cy, rr, Math.max(4.5f, rr * 0.2f), (float) f[i], col[i], 0x1FFFFFFF);
                textC(em[i], cx, cy + rr * 0.3f, rr * 0.8f, fm, WHITE);
                textC(lb[i], cx, H - 12, 11, fb, WHITE);
            }
            return;
        }
        logo(14, 24, "Hafif", WHITE);
        textR(WidgetData.todayLong(d.now), W - 14, 24, 11.5f, fm, 0xB3FFFFFF);
        float y = 46, mw = W - 28;
        y = barRow("💧 Su", WidgetData.n0(w) + " / " + WidgetData.n0(wg) + " ml", w / wg, WATER, y, mw);
        y = barRow("🥚 Protein", WidgetData.n0(pr) + " / " + WidgetData.n0(pg) + " g", pr / pg, PROT, y, mw);
        if (hs && H >= 170) barRow("👣 Adım", WidgetData.n0(st) + " / " + WidgetData.n0(sg), st / sg, STEP, y, mw);
        buttons(r, new String[][]{{"+250 ml su", "water/250"}, {"Kilo gir", "weight"}}, new int[]{0x335BC0F5, 0x299FF0D6}, new int[]{0xFFBFE6FB, MINT});
    }

    private float barRow(String a, String b, double f, int col, float y, float mw) {
        text(a, 14, y + 10, 11.5f, fm, WHITE, mw / 2);
        textR(b, W - 14, y + 10, 11.5f, fb, WHITE);
        bar(14, y + 16, mw, 7, (float) f, col, 0x24FFFFFF);
        return y + 33;
    }

    private void kilo(WidgetData d, Result r, boolean wide) {
        r.main = "weight";
        bg(false);
        JSONObject k = d.obj("w");
        if (k == null) { center("İlk tartını gir", H / 2, 14, fb, EM); return; }
        float y0 = H / 2 - 22;
        text(wide ? "HAFİF · GÜNCEL" : "GÜNCEL", 16, y0, 9, fb, ACC, 140, 1.2f);
        float tw = text(WidgetData.n1(k.optDouble("cur")), 16, y0 + 28, 26, db, EM, 120);
        text(" kg", 16 + tw, y0 + 28, 12, fm, MUTED, 40);
        String ch = WidgetData.sgn(k.optDouble("change")) + " kg";
        if (wide && k.has("pct") && !k.isNull("pct")) ch += " · hedefe %" + Math.round(k.optDouble("pct"));
        text(ch, 16, y0 + 46, 11.5f, fb, ACC, wide ? 160 : W - 30);
        if (wide) {
            float x = 180, sw = W - x - 58;
            spark(k.optJSONArray("pts"), null, x, 14, sw, H - 28, ACC, false);
            float cx = W - 32, cy = H / 2;
            p.setColor(EM);
            c.drawCircle(cx, cy, 17, p);
            textC("+", cx, cy + 7, 22, fb, MINT);
        }
    }

    private void grafik(WidgetData d, Result r, boolean wide) {
        r.main = "tab/kilo";
        bg(false);
        JSONObject k = d.obj("w");
        if (k == null || k.optJSONArray("pts") == null || k.optJSONArray("pts").length() < 2) {
            center("Grafik için 2 tartı gerekli", H / 2, 13, fb, EM);
            return;
        }
        if (!wide) {
            text("SON 30 GÜN", 16, 26, 9, fb, ACC, W - 30, 1.2f);
            text(WidgetData.sgn(k.optDouble("d30")) + " kg", 16, 48, 18, db, EM, W - 30);
            spark(k.optJSONArray("pts"), null, 14, 60, W - 28, H - 74, ACC, false);
            return;
        }
        text("KİLO · SON 30 GÜN", 16, 26, 9, fb, ACC, 200, 1.2f);
        if (k.has("perWeek") && !k.isNull("perWeek")) textR("haftada " + WidgetData.sgn(k.optDouble("perWeek")) + " kg", W - 16, 26, 11.5f, fb, ACC);
        float tw = text(WidgetData.n1(k.optDouble("cur")), 16, 54, 22, db, EM, 120);
        text(WidgetData.n1(k.optDouble("first30")) + " → " + WidgetData.n1(k.optDouble("cur")) + " kg", 24 + tw, 54, 11.5f, fm, MUTED, 200);
        spark(k.optJSONArray("pts"), k.optJSONArray("shots"), 16, 66, W - 32, H - 82, ACC, true);
    }

    private void hedef(WidgetData d, Result r, boolean wide) {
        r.main = "tab/basari";
        bg(true);
        JSONObject k = d.obj("w");
        if (k == null || !k.has("pct") || k.isNull("pct")) {
            logo(14, 22, "Hedef", WHITE);
            center("Hedef kilonu belirle", H / 2 + 4, 14, fb, WHITE);
            r.main = "tab/ayar";
            return;
        }
        float pct = (float) Math.max(0, Math.min(100, k.optDouble("pct")));
        String left = WidgetData.n1(Math.max(0, k.optDouble("left"))) + " kg";
        if (!wide) {
            logo(14, 22, "Hedef", WHITE);
            float rr = Math.min(W, H) * 0.3f, cy = H * 0.5f + 1;
            ring(W / 2, cy, rr, Math.max(7, rr * 0.17f), pct / 100f, MINT, 0x1FFFFFFF);
            center("%" + Math.round(pct), cy + rr * 0.12f, rr * 0.45f, db, WHITE);
            center(WidgetData.n0(k.optDouble("goal")) + " kg hedef", cy + rr * 0.45f, 10, fm, 0xB3FFFFFF);
            textC(left + " kaldı", W / 2, H - 14, 12, fb, MINT);
            return;
        }
        float rr = (H - 30) / 2, cx = 16 + rr, cy = H / 2;
        ring(cx, cy, rr, Math.max(8, rr * 0.16f), pct / 100f, MINT, 0x1FFFFFFF);
        textC("%" + Math.round(pct), cx, cy + rr * 0.12f, rr * 0.45f, db, WHITE);
        textC("hedefe", cx, cy + rr * 0.42f, 10.5f, fm, 0xB3FFFFFF);
        float x = cx + rr + 18, mw = W - x - 14;
        logo(x, 24, "Hafif", WHITE);
        text("KALAN", x, 46, 8.5f, fb, 0xB3FFFFFF, mw, 1.2f);
        text(left, x, 66, 18, db, WHITE, mw);
        JSONObject b = d.obj("badge");
        if (b != null) {
            rrect(x, 78, mw, 40, 12, 0x2EC9A04A);
            textC("🏅", x + 18, 104, 18, fm, WHITE);
            text("SIRADAKİ ROZET", x + 36, 93, 8, fb, GOLD, mw - 40, 1.1f);
            text(b.optString("t") + " · " + WidgetData.n1(b.optDouble("left")) + " kg kaldı", x + 36, 109, 12, fb, WHITE, mw - 42);
        }
    }

    private void su(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg(true);
        double w = d.water(), g = d.waterGoal();
        float f = (float) Math.min(1, w / g);
        if (!wide) {
            float gh = H - 74, gw = gh * 0.62f;
            glass(14, 16, gw, gh, f);
            float x = 14 + gw + 12;
            text("SU", x, 30, 8.5f, fb, 0xB3FFFFFF, W - x - 10, 1.2f);
            text(WidgetData.n0(w), x, 52, 18, db, WHITE, W - x - 10);
            text("/ " + WidgetData.n0(g) + " ml", x, 68, 11, fm, 0xB3FFFFFF, W - x - 10);
            buttons(r, new String[][]{{"+250 ml", "water/250"}}, new int[]{0x405BC0F5}, new int[]{0xFFBFE6FB});
            return;
        }
        float gh = H - 28, gw = gh * 0.62f;
        glass(16, 14, gw, gh, f);
        float x = 16 + gw + 18, mw = W - x - 14;
        logo(x, 24, "Hafif", WHITE);
        float tw = text(WidgetData.n0(w), x, 56, 26, db, WHITE, mw);
        text(" / " + WidgetData.n0(g) + " ml", x + tw, 56, 11.5f, fm, 0xB3FFFFFF, mw - tw);
        bar(x, 68, mw, 7, f, WATER, 0x24FFFFFF);
        buttonsAt(r, x, new String[][]{{"+250 ml", "water/250"}, {"+500 ml", "water/500"}}, new int[]{0x405BC0F5, 0x405BC0F5}, new int[]{0xFFBFE6FB, 0xFFBFE6FB});
    }

    private void protein(WidgetData d, Result r, boolean wide) {
        r.main = "protein";
        bg(true);
        double pr = d.protein(), g = d.proteinGoal();
        JSONArray cols = d.fresh && d.day() != null ? d.day().optJSONArray("pc") : null;
        int of = (int) Math.max(12, Math.ceil(g / 5));
        if (!wide) {
            text("PROTEİN", 14, 24, 8.5f, fb, 0xB3FFFFFF, 80, 1.2f);
            textR("%" + Math.round(Math.min(100, pr / g * 100)), W - 14, 24, 11, fm, 0xB3FFFFFF);
            float tw = text(WidgetData.n0(pr), 14, 54, 24, db, WHITE, 80);
            text(" / " + WidgetData.n0(g) + " g", 14 + tw, 54, 11, fm, 0xB3FFFFFF, 80);
            blocks(cols, of, 14, 68, W - 28, H - 82, 8);
            return;
        }
        logo(14, 24, "Hafif", WHITE);
        textR(WidgetData.n0(Math.max(0, g - pr)) + " g kaldı", W - 14, 24, 11.5f, fm, 0xB3FFFFFF);
        float tw = text(WidgetData.n0(pr), 14, 62, 28, db, WHITE, 90);
        text(" / " + WidgetData.n0(g) + " g", 14 + tw, 62, 11, fm, 0xB3FFFFFF, 80);
        blocks(cols, of, 120, 38, W - 134, 50, 11);
        JSONArray foods = d.fresh && d.day() != null ? d.day().optJSONArray("foods") : null;
        float x = 14;
        if (foods != null) for (int i = 0; i < foods.length() && i < 3; i++) {
            float cw = chip(foods.optString(i), x, H - 34, 11, 0x1FFFFFFF, WHITE, W - x - 70);
            x += cw + 6;
            if (x > W - 120) break;
        }
        chip("+ Ekle", Math.min(x, W - 70), H - 34, 11, 0x40E6B35A, 0xFFF3D29A, 60);
    }

    private void adim(WidgetData d, Result r, boolean wide) {
        r.main = "tab/adim";
        bg(true);
        if (!d.hasSteps()) {
            logo(14, 22, "Adım", WHITE);
            center("Adımlarını bağla", H / 2 + 2, 14, fb, WHITE);
            center("Health Connect ile", H / 2 + 20, 11, fm, 0xB3FFFFFF);
            return;
        }
        double st = d.steps(), g = d.stepGoal();
        JSONObject day = d.day();
        String km = day != null && d.fresh ? WidgetData.n1(day.optDouble("km")) : "0";
        String mn = day != null && d.fresh ? WidgetData.n0(day.optDouble("min")) : "0";
        if (!wide) {
            logo(14, 22, "Adım", WHITE);
            float rr = Math.min(W, H) * 0.3f, cy = H * 0.5f + 1;
            ring(W / 2, cy, rr, Math.max(7, rr * 0.17f), (float) (st / g), STEP, 0x1FFFFFFF);
            center(WidgetData.n0(st), cy + rr * 0.1f, rr * 0.36f, db, WHITE);
            center("/ " + WidgetData.n0(g), cy + rr * 0.42f, 10, fm, 0xB3FFFFFF);
            textC(km + " km · " + mn + " dk", W / 2, H - 14, 11.5f, fm, 0xC0FFFFFF);
            return;
        }
        float rr = (H - 30) / 2, cx = 16 + rr, cy = H / 2;
        ring(cx, cy, rr, Math.max(8, rr * 0.15f), (float) (st / g), STEP, 0x1FFFFFFF);
        textC(WidgetData.n0(st), cx, cy + rr * 0.1f, rr * 0.36f, db, WHITE);
        textC("adım", cx, cy + rr * 0.42f, 10.5f, fm, 0xB3FFFFFF);
        float x = cx + rr + 18, mw = W - x - 14;
        logo(x, 24, "Hafif", WHITE);
        text(WidgetData.n0(Math.max(0, g - st)) + " adım kaldı · " + km + " km", x, 44, 11.5f, fm, 0xC0FFFFFF, mw);
        JSONArray wk = day != null ? day.optJSONArray("wk") : null;
        if (wk != null && wk.length() > 0) {
            int n = wk.length();
            float bw = mw / n, top = 56, bh = H - top - 30;
            double mx = g;
            for (int i = 0; i < n; i++) mx = Math.max(mx, wk.optDouble(i));
            for (int i = 0; i < n; i++) {
                double v = (i == n - 1 && !d.fresh) ? 0 : wk.optDouble(i);
                float h = (float) Math.max(3, v / mx * bh);
                rrect(x + i * bw + bw * 0.2f, top + bh - h, bw * 0.6f, h, 4, v >= g ? STEP : 0x668C9BF0);
            }
            JSONArray lb = day.optJSONArray("wkl");
            if (lb != null) for (int i = 0; i < n && i < lb.length(); i++)
                textC(lb.optString(i), x + i * bw + bw / 2, H - 14, 9.5f, fm, 0x99FFFFFF);
        }
    }

    private void takviye(WidgetData d, Result r, boolean wide) {
        r.main = "tab/takviye";
        bg(true);
        JSONArray days = d.o.optJSONArray("supp");
        JSONArray slots = null;
        if (days != null) for (int i = 0; i < days.length(); i++) {
            JSONObject x = days.optJSONObject(i);
            if (x != null && d.today.equals(x.optString("d"))) { slots = x.optJSONArray("s"); break; }
        }
        if (slots == null || slots.length() == 0) {
            logo(14, 22, "Takviye", WHITE);
            center("Bugün takviye yok", H / 2 + 4, 14, fb, WHITE);
            return;
        }
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
        if (!wide) {
            logo(14, 22, "Takviye", WHITE);
            chipR(done + "/" + of, W - 14, 10, 11, 0x1FFFFFFF, WHITE);
            if (nx == null) {
                center("Bugün hepsi alındı", H / 2 + 6, 14, fb, MINT);
                return;
            }
            text("SIRADAKİ · " + nx.optString("t"), 14, 52, 8.5f, fb, 0xB3FFFFFF, W - 28, 1.2f);
            text(nx.optString("n"), 14, 72, 17, db, WHITE, W - 28);
            text(nx.optString("names"), 14, 88, 11.5f, fm, 0xC0FFFFFF, W - 28);
            buttons(r, new String[][]{{"Hepsini aldım", "supp/" + nx.optString("k")}}, new int[]{0x4D7B5BD0}, new int[]{SUPP});
            return;
        }
        logo(14, 24, "Hafif", WHITE);
        chipR("Bugün " + done + "/" + of, W - 14, 12, 11, 0x1FFFFFFF, WHITE);
        // en fazla iki vakit: sıradaki ve ondan önceki (yoksa ilk ikisi)
        int ni = 0;
        for (int i = 0; i < slots.length(); i++) if (slots.optJSONObject(i) == nx) { ni = i; break; }
        int a = Math.max(0, Math.min(ni - (nx == null ? 0 : 1), slots.length() - 2));
        int cnt = Math.min(2, slots.length());
        float cw = (W - 28 - 8 * (cnt - 1)) / cnt;
        for (int j = 0; j < cnt; j++) {
            JSONObject sl = slots.optJSONObject(a + j);
            float x = 14 + j * (cw + 8);
            rrect(x, 38, cw, 62, 14, 0x12FFFFFF);
            text(sl.optString("e") + " " + sl.optString("n") + " · " + sl.optString("t"), x + 10, 56, 11.5f, fb, WHITE, cw - 20);
            text(sl.optString("names"), x + 10, 72, 11, fm, 0xC0FFFFFF, cw - 20);
            boolean ok = useLog && sl.optInt("done") >= sl.optInt("of");
            text(ok ? "✓ alındı" : "bekliyor", x + 10, 90, 11, fb, ok ? MINT : SUPP, cw - 20);
        }
        if (nx != null)
            buttons(r, new String[][]{{nx.optString("n") + " takviyelerini aldım", "supp/" + nx.optString("k")}}, new int[]{0x4D7B5BD0}, new int[]{SUPP});
    }

    // ---------- Plus kilidi ----------
    private Bitmap locked(Bitmap src, float s) {
        int bw = Math.max(1, src.getWidth() / 10), bh = Math.max(1, src.getHeight() / 10);
        Bitmap small = Bitmap.createScaledBitmap(src, bw, bh, true);
        Bitmap blur = Bitmap.createScaledBitmap(small, src.getWidth(), src.getHeight(), true);
        Bitmap out = Bitmap.createBitmap(src.getWidth(), src.getHeight(), Bitmap.Config.ARGB_8888);
        c = new Canvas(out);
        c.scale(s, s);
        bg(true);
        Paint ip = new Paint(Paint.FILTER_BITMAP_FLAG);
        ip.setAlpha(110);
        c.save();
        c.scale(1 / s, 1 / s);
        c.drawBitmap(blur, 0, 0, ip);
        c.restore();
        float cy = H / 2;
        center("✦ HAFİF PLUS", cy - 14, 11.5f, fb, MINT, 1.2f);
        center("Widget'lar Plus'ta", cy + 4, 12.5f, fm, WHITE);
        float bw2 = 64, bx = W / 2 - bw2 / 2;
        rrect(bx, cy + 14, bw2, 24, 12, MINT);
        textC("Aç", W / 2, cy + 30.5f, 12, fb, EM);
        return out;
    }

    // ---------- çizim yardımcıları ----------
    private void bg(boolean darkBg) {
        dark = darkBg;
        RectF r = new RectF(0, 0, W, H);
        p.setShader(null);
        p.setStyle(Paint.Style.FILL);
        p.setColor(0xFF000000); // önceki çizimden kalan saydamlık gölgelendiriciye geçmesin
        if (darkBg) {
            p.setShader(new LinearGradient(0, 0, W * 0.6f, H, 0xFF0B3B33, 0xFF062520, Shader.TileMode.CLAMP));
            c.drawRoundRect(r, 22, 22, p);
            p.setColor(0xFF000000);
            p.setShader(new RadialGradient(W, 0, Math.max(W, H) * 0.9f, 0x991F8A70, 0x001F8A70, Shader.TileMode.CLAMP));
            c.drawRoundRect(r, 22, 22, p);
        } else {
            p.setColor(0xF7FFFFFF);
            c.drawRoundRect(r, 22, 22, p);
        }
        p.setShader(null);
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
        p.setColor(dark ? track : 0xFFEDF3F0);
        c.drawCircle(cx, cy, r, p);
        if (f > 0.005f) {
            p.setColor(col);
            c.drawArc(new RectF(cx - r, cy - r, cx + r, cy + r), -90, 360 * f, false, p);
        }
        p.setStyle(Paint.Style.FILL);
    }

    private void bar(float x, float y, float w, float h, float f, int col, int track) {
        f = Math.max(0, Math.min(1, f));
        rrect(x, y, w, h, h / 2, dark ? track : 0xFFEDF3F0);
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

    private void logo(float x, float y, String label, int col) {
        Path leaf = new Path();
        float s = 11 / 24f, ox = x, oy = y - 10;
        leaf.moveTo(ox + 5 * s, oy + 21 * s);
        leaf.lineTo(ox + 5 * s, oy + 12 * s);
        leaf.cubicTo(ox + 5 * s, oy + 7.6f * s, ox + 8.6f * s, oy + 4 * s, ox + 13 * s, oy + 4 * s);
        leaf.lineTo(ox + 19 * s, oy + 4 * s);
        leaf.lineTo(ox + 19 * s, oy + 10 * s);
        leaf.cubicTo(ox + 19 * s, oy + 14.4f * s, ox + 15.4f * s, oy + 18 * s, ox + 11 * s, oy + 18 * s);
        leaf.lineTo(ox + 7 * s, oy + 18 * s);
        leaf.moveTo(ox + 9 * s, oy + 15 * s);
        leaf.lineTo(ox + 15 * s, oy + 9 * s);
        p.setShader(null);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(1.6f);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(col);
        p.setAlpha(dark ? 200 : 255);
        c.drawPath(leaf, p);
        p.setStyle(Paint.Style.FILL);
        p.setAlpha(255);
        text(label, x + 15, y, 11, fb, dark ? 0xCCFFFFFF : ACC, 120);
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
        p.setColor(0x1AFFFFFF);
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
        p.setColor(0x66FFFFFF);
        c.drawPath(g, p);
        p.setStyle(Paint.Style.FILL);
    }

    private void blocks(JSONArray cols, int of, float x, float y, float w, float h, int perRow) {
        int rows = (int) Math.ceil(of / (double) perRow);
        float gap = 3, sz = Math.min((w - gap * (perRow - 1)) / perRow, (h - gap * (rows - 1)) / rows);
        for (int i = 0; i < of; i++) {
            int col = cols != null && i < cols.length() ? parse(cols.optString(i)) : 0x1FFFFFFF;
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
            p.setColor(0x80E2643D);
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
            rrect(x, y, w, 32, 12, bgc[i]);
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
