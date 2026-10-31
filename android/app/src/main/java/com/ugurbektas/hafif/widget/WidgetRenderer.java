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
        String[] zones; // Pano: {kilo, protein, su, adım, sol kart, sağ kart} dokunma eylemleri
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
        // ekip toplantısı 3: açık temada kâğıt, koyu temada koyu zümrüt-gri kart; konu rengi zeminde değil veride
        BG = night ? 0xFF13251F : 0xFFFBFAF7;
        FG = night ? 0xFFE6F2ED : 0xFF0B2420;
        MU = night ? 0xFF93ABA4 : 0xFF62756F;
        WL = night ? 0xFF1A2F2A : 0xFFEEF2F0;
        PRO = night ? 0xFFE3A24A : 0xFFC27A12; PRO_S = night ? 0xFF3A2A12 : 0xFFFBEFD9;
        SU = night ? 0xFF5AAEDE : 0xFF2E8BC0; SU_S = night ? 0xFF12304A : 0xFFE2F0F8;
        AD = night ? 0xFF4CBFD3 : 0xFF1C8EA6;
        TK = night ? 0xFFE890B3 : 0xFFB8577A; TK_S = night ? 0xFF3D1F2C : 0xFFF7E6ED;
        IG = night ? 0xFF8EA6EA : 0xFF33509A; IG_S = night ? 0xFF1E2847 : 0xFFE6EBF6;
        KI = night ? 0xFF4FD1A8 : 0xFF0E7C66; KI_S = night ? 0xFF123B32 : 0xFFE1F3EC;
        AC = night ? MINT : ACC;
        BTN = night ? MINT : EM;
        BTNF = night ? EM : WHITE;
        SOFT = night ? 0x1F9FF0D6 : 0xFFEAF2EE;
        TRACK = night ? 0xFF203832 : 0xFFE9EEEB;
    }

    private final boolean night;
    private final int BG, FG, MU, AC, BTN, BTNF, SOFT, TRACK, WL, PRO, PRO_S, SU, SU_S, AD, TK, TK_S, IG, IG_S, KI, KI_S;
    private static final int ZM = 0xB3FFFFFF; // zümrüt üstünde soluk yazı

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
            emptyG("yaprak", "Hafif'i bir kez aç", "widget verileri hazırlansın", KI);
            r.main = "tab/ozet";
        } else {
            draw(kind, d, r);
            if (!d.plus()) {
                r.buttons.clear();
                r.zones = null;
                bmp = locked(bmp, s);
                r.main = "plus";
            }
        }
        r.bmp = bmp;
        return r;
    }

    // ---------- 12 widget (ekip toplantısı 3: kâğıt + zümrüt vitrin, konu rengi veride, tek renkli ikonlar) ----------
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
            case 12: pano(d, r); break;
            default: takviye(d, r, wide); break;
        }
    }

    private boolean low() { return H < 120; }

    /** Boş durum: ortada ikon, başlık ve tek satır açıklama. */
    private void emptyG(String g, String t, String sub, int col) {
        bg();
        float gw = Math.min(34, H * 0.3f);
        glyphC(g, W / 2, H / 2 - 14, gw, col);
        center(t, H / 2 + 18, 14, db, FG);
        center(sub, H / 2 + 34, 11, fm, MU);
    }

    /** Başlık satırı: konu renginde ikon, cümle düzeninde etiket, isteğe bağlı sağ yazı. */
    private void hdr(String g, String label, int gc, int lc, String right) {
        glyph(g, 16, 14, 18, gc);
        text(label, 39, 27, 12, fb, lc, W - 56 - (right == null ? 0 : 70));
        if (right != null) textR(right, W - 16, 27, 12, fb, lc);
    }

    /** Alçak boy (küçültülmüş) widget: üstte ikon ve etiket, altında büyük değer; yer varsa alt satır ve çubuk. */
    private void compact(String g, String label, int col, String big, String sub, float frac, int barCol) {
        glyph(g, 16, 14, 16, col);
        text(label, 37, 25, 11.5f, fb, MU, W - 52);
        boolean hasSub = sub != null && H >= 96, hasBar = frac >= 0;
        float y = hasSub ? Math.min(H - 38, 58) : Math.min(H - (hasBar ? 22 : 14), 56);
        text(big, 16, y, big.length() > 11 ? 18 : 22, db, FG, W - 32);
        if (hasSub) text(sub, 16, y + 16, 11, fm, MU, W - 32);
        if (hasBar) bar(16, H - 16, W - 32, 5, Math.max(0, Math.min(1, frac)), barCol, TRACK);
    }

    /** Sağ altta konu renginde yuvarlak +; üst katmandaki tıklama alanıyla hizalı (14dp kenar, 32dp yükseklik). */
    private void plusBtn(Result r, String action, int col, int cross) {
        float cx = W - 14 - 18, cy = H - 14 - 16;
        p.setShader(null);
        p.setStyle(Paint.Style.FILL);
        p.setColor(col);
        c.drawCircle(cx, cy, 18, p);
        plusMark(cx, cy, 6.5f, cross, 2.4f);
        r.buttons.add(new String[]{"Ekle", action});
        r.buttonsLeft = W - 50;
    }

    private void plusMark(float cx, float cy, float a, int col, float sw) {
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(sw);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(col);
        c.drawLine(cx - a, cy, cx + a, cy, p);
        c.drawLine(cx, cy - a, cx, cy + a, p);
        p.setStyle(Paint.Style.FILL);
    }

    private int onColor() { return night ? 0xFF0B1C19 : WHITE; }

    /** Halka + ortasında ikon. */
    private void ringG(float cx, float cy, float s, float st, float f, int col, String g) {
        ring(cx, cy, s / 2 - st / 2, st, f, col, TRACK);
        if (g != null) glyphC(g, cx, cy, s * 0.42f, col);
    }

    /** Ortalanmış "değer birim" satırı: değer Outfit, birim soluk. */
    private void valueC(String v, String unit, float cx, float y, float vs, float us) {
        tp.setLetterSpacing(0);
        tp.setTypeface(db);
        tp.setTextSize(vs);
        float a = tp.measureText(v);
        tp.setTypeface(fb);
        tp.setTextSize(us);
        float b = unit == null ? 0 : tp.measureText(" " + unit);
        float x = cx - (a + b) / 2;
        text(v, x, y, vs, db, FG, 0);
        if (unit != null) text(" " + unit, x + a, y, us, fb, MU, 0);
    }

    private void dongu(WidgetData d, Result r, boolean wide) {
        r.main = "tab/igne";
        if (noShots(d, r)) return;
        bg();
        String ph = d.phaseName();
        String sub = d.cycleDay() == 1 ? "iğne günü" : "iğneden sonra " + (d.cycleDay() - 1) + ". gün";
        if (low()) { compact("ay", "Döngü", IG, ph, sub, d.cycleFrac(), IG); return; }
        hdr("ay", "Döngü", IG, MU, null);
        if (!wide) {
            float R = Math.max(20, Math.min(40, (H - 102) / 2)), cx = 16 + R + 6, cy = 42 + R + 6;
            wheel(cx, cy, R, d.cycleDays(), d.cycleDay() - 1);
            textC(d.cycleDay() + "/" + d.cycleDays(), cx, cy + R * 0.16f, R * 0.44f, db, FG);
            text(ph, 16, H - 30, 18, db, FG, W - 32);
            text(sub, 16, H - 14, 11.5f, fm, MU, W - 32);
            return;
        }
        float R = Math.max(22, Math.min(50, (H - 52) / 2)), cx = 16 + R + 6, cy = 36 + (H - 36) / 2;
        wheel(cx, cy, R, d.cycleDays(), d.cycleDay() - 1);
        textC(d.cycleDay() + "/" + d.cycleDays(), cx, cy + R * 0.16f, R * 0.44f, db, FG);
        float x = cx + R + 22, mw = W - x - 16;
        text(ph + " evresi", x, H >= 150 ? 62 : 58, 22, db, FG, mw);
        if (H >= 150) wrap(d.phaseTip(), x, 84, mw, 12, fm, MU, 2);
        else text(sub, x, 76, 11.5f, fm, MU, mw);
        text("Yeni iğne: " + dayWord(d).toLowerCase(WidgetData.TR) + (d.nextTs() > 0 ? " " + hm(d.nextTs()) : ""), x, H - 16, 11.5f, fb, FG, mw);
    }

    /** Döngü çarkı: her gün bir dilim; geçen günler soluk, bugün kalın. */
    private void wheel(float cx, float cy, float R, int n, int cur) {
        n = Math.max(1, n);
        RectF ov = new RectF(cx - R, cy - R, cx + R, cy + R);
        p.setShader(null);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeCap(Paint.Cap.ROUND);
        float seg = 360f / n;
        for (int i = 0; i < n; i++) {
            p.setStrokeWidth(i == cur ? R * 0.28f : R * 0.2f);
            p.setColor(i < cur ? mix(IG, BG, 0.45f) : i == cur ? IG : TRACK);
            c.drawArc(ov, -90 + i * seg + 5, seg - 10, false, p);
        }
        p.setStyle(Paint.Style.FILL);
    }

    private static int mix(int a, int b, float t) {
        int ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255, br = (b >> 16) & 255, bgn = (b >> 8) & 255, bb = b & 255;
        return 0xFF000000 | (Math.round(ar * t + br * (1 - t)) << 16) | (Math.round(ag * t + bgn * (1 - t)) << 8) | Math.round(ab * t + bb * (1 - t));
    }

    private boolean noShots(WidgetData d, Result r) {
        if (d.shots() && d.cyc() != null) return false;
        if (d.shots()) emptyG("igne", "Henüz iğne yok", "ilk iğneni Hafif'e ekle", IG);
        else emptyG("igne", "İğne takibi kapalı", "Ayarlar'dan açabilirsin", IG);
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

    private void siradaki(WidgetData d, Result r, boolean wide, boolean tall) {
        r.main = "shot";
        if (noShots(d, r)) return;
        bg();
        JSONObject n = d.next();
        String day = dayWord(d), site = n == null ? "" : n.optString("site", "").toLowerCase(WidgetData.TR);
        String t = d.nextTs() > 0 ? hm(d.nextTs()) : "";
        if (!tall) {
            float ic = Math.min(42, H - 28), cx = 14 + ic / 2, cy = H / 2;
            p.setShader(null);
            p.setColor(IG_S);
            c.drawCircle(cx, cy, ic / 2, p);
            glyphC("igne", cx, cy, ic * 0.58f, IG);
            float x = 14 + ic + 12;
            text(day + (t.isEmpty() ? "" : " " + t), x, cy + 1, wide ? 20 : 17, db, FG, W - x - 12);
            text(site.isEmpty() ? "sıradaki iğne" : site, x, cy + 18, 11.5f, fm, MU, W - x - 12);
            return;
        }
        hdr("igne", "Sıradaki iğne", IG, MU, null);
        text(day, 16, 70, day.length() > 7 ? 26 : 32, db, FG, W - 32);
        text(t + (site.isEmpty() ? "" : " · " + site), 16, 90, 12, fm, MU, W - 32);
        if (wide && n != null) {
            String dose = n.optString("dose", "");
            if (n.has("pen") && !n.isNull("pen") && n.optInt("pen") <= 1)
                chipR(n.optInt("pen") <= 0 ? "Kalem bitti" : "Son doz · yeni kalem", W - 16, 12, 11, PRO_S, PRO);
            else if (!dose.isEmpty()) chipR(dose + " mg", W - 16, 12, 11, IG_S, IG);
        }
        if (H >= 140) weekStrip(d, 16, H - 14 - 26, W - 32, 26);
    }

    /** Önümüzdeki 7 gün: bugün çerçeveli, iğne günü dolu. */
    private void weekStrip(WidgetData d, float x, float y, float w, float h) {
        String[] L = {"P", "P", "S", "Ç", "P", "C", "C"};
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTimeInMillis(d.now);
        int shot = d.nextTs() > 0 ? WidgetData.dayDiff(d.now, d.nextTs()) : -1;
        float gap = 4, cw = (w - gap * 6) / 7;
        for (int i = 0; i < 7; i++) {
            float cx = x + i * (cw + gap);
            int wd = cal.get(java.util.Calendar.DAY_OF_WEEK) - 1;
            boolean sh = i == shot;
            rrect(cx, y, cw, h, 9, sh ? IG : i == 0 ? IG_S : WL);
            textC(L[wd], cx + cw / 2, y + h / 2 + 4, 11, fb, sh ? onColor() : i == 0 ? IG : MU);
            cal.add(java.util.Calendar.DAY_OF_MONTH, 1);
        }
    }

    private void bugun(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg();
        double w = d.water(), wg = d.waterGoal(), pr = d.protein(), pg = d.proteinGoal(), st = d.steps(), sg = d.stepGoal();
        int n = d.hasSteps() ? 3 : 2;
        String[] gk = {"protein", "su", "adim"}, nm = {"Protein", "Su", "Adım"};
        int[] col = {PRO, SU, AD};
        float[] f = {(float) (pr / pg), (float) (w / wg), (float) (st / sg)};
        String[] val = {WidgetData.n0(pr) + " g", WidgetData.n1(w / 1000) + " L", WidgetData.n0(st)};
        String[] sub = {pr >= pg ? "tamam" : WidgetData.n0(pg - pr) + " g kaldı", w >= wg ? "tamam" : (int) Math.ceil((wg - w) / 250) + " bardak", st >= sg ? "tamam" : WidgetData.n0(sg - st) + " kaldı"};
        if (!wide && low()) {
            glyph("yaprak", 16, 14, 16, KI);
            text("Bugün", 37, 25, 11.5f, fb, MU, W - 52);
            int fit = Math.max(1, Math.min(n, (int) ((H - 36) / 14)));
            float y = 44, step = Math.max(14, (H - 50) / fit);
            for (int i = 0; i < fit; i++) { text(nm[i] + " · " + sub[i], 16, y + 4, 11, fb, FG, W - 32); y += step; }
            return;
        }
        hdr("yaprak", "Bugün", KI, MU, wide ? WidgetData.todayLong(d.now) : null);
        if (!wide) {
            float cw = (W - 24) / n, s = Math.min(46, Math.min(cw - 8, H - 110)), cy = 42 + s / 2 + 4;
            for (int i = 0; i < n; i++) {
                float cx = 12 + cw * i + cw / 2;
                ringG(cx, cy, s, 5, f[i], col[i], gk[i]);
                textC(val[i], cx, cy + s / 2 + 18, 13, db, FG);
                textC(sub[i], cx, cy + s / 2 + 32, 10.5f, fm, MU);
            }
            return;
        }
        boolean btn = H >= 140;
        float bottom = btn ? H - 54 : H - 12, s = Math.max(30, Math.min(52, bottom - 40)), cy = 36 + (bottom - 36) / 2;
        float cw = (W - 32) / n;
        for (int i = 0; i < n; i++) {
            float x = 16 + i * cw;
            ringG(x + s / 2, cy, s, 6, f[i], col[i], gk[i]);
            text(val[i], x + s + 9, cy - 1, 17, db, FG, cw - s - 14);
            text(sub[i], x + s + 9, cy + 15, 11, fm, MU, cw - s - 14);
        }
        if (btn) buttons(r, new String[][]{{"+ 250 ml su", "water/250"}, {"+ Protein", "protein"}}, new int[]{SU_S, PRO_S}, new int[]{SU, PRO});
    }

    private void kilo(WidgetData d, Result r, boolean wide, boolean tall) {
        r.main = "weight";
        JSONObject k = d.obj("w");
        if (k == null) { emptyG("dusus", "İlk tartını gir", "dokun, kilonu ekle", KI); return; }
        zbg(0, 0, W, H, 24, 24);
        String cur = WidgetData.n1(k.optDouble("cur")), ch = WidgetData.sgn(k.optDouble("change")) + " kg";
        if (!tall) {
            float sz = Math.min(28, H * 0.34f), y = H / 2 + 2;
            float tw = text(cur, 16, y, sz, db, WHITE, W - 96);
            text(" kg", 16 + tw, y, 12, fb, ZM, 30);
            text(ch + " başından", 16, y + 18, 11.5f, fb, MINT, W - 70);
            float cx = W - 14 - 16;
            p.setShader(null);
            p.setColor(MINT);
            c.drawCircle(cx, H / 2, 16, p);
            plusMark(cx, H / 2, 6, EM, 2.4f);
            return;
        }
        glyph("yaprak", 16, 14, 18, MINT);
        text("Kilo", 39, 27, 12, fb, MINT, 120);
        if (!wide) {
            float tw = text(cur, 16, 76, 38, db, WHITE, W - 50);
            text(" kg", 16 + tw, 76, 14, fb, ZM, 30);
            chip(ch, 16, 86, 11.5f, 0x299FF0D6, MINT, W - 32);
            if (H >= 150) spark(k.optJSONArray("pts"), null, 16, H - 46, W - 32, 34, MINT, false);
            return;
        }
        float tw = text(cur, 16, 78, 42, db, WHITE, 150);
        text(" kg", 16 + tw, 78, 14, fb, ZM, 30);
        chip(ch + " başından", 16, 90, 11.5f, 0x299FF0D6, MINT, 150);
        String eta = etaWord(k, d.now);
        if (!eta.isEmpty() && H >= 140) text(WidgetData.cap(eta), 16, H - 16, 11.5f, fb, ZM, 150);
        spark(k.optJSONArray("pts"), null, 186, 18, W - 202, H - 36, MINT, false);
    }

    /** Zümrüt yüzey: koyu zümrüt geçiş ve sağ üstte ışık. */
    private void zbg(float x, float y, float w, float h, float rTop, float rBot) {
        Path pa = new Path();
        pa.addRoundRect(new RectF(x, y, x + w, y + h), new float[]{rTop, rTop, rTop, rTop, rBot, rBot, rBot, rBot}, Path.Direction.CW);
        p.setStyle(Paint.Style.FILL);
        p.setShader(new LinearGradient(x, y, x + w * 0.4f, y + h, 0xFF0F4C41, 0xFF072420, Shader.TileMode.CLAMP));
        c.drawPath(pa, p);
        p.setShader(new RadialGradient(x + w, y, Math.max(w, h) * 0.8f, 0x9922917A, 0x0022917A, Shader.TileMode.CLAMP));
        c.drawPath(pa, p);
        p.setShader(null);
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

    /** "Aralık" (etaWord içinden yalnızca ay). */
    private static String monthOf(String eta) {
        if (eta == null || !eta.startsWith("hedefe ")) return "";
        return eta.replace("hedefe ", "").replace(" civarı", "");
    }

    private void grafik(WidgetData d, Result r, boolean wide) {
        r.main = "tab/kilo";
        bg();
        JSONObject k = d.obj("w");
        if (k == null || k.optJSONArray("pts") == null || k.optJSONArray("pts").length() < 2) {
            emptyG("dusus", "Grafik için 2 tartı", "tartıların geldikçe çizilir", KI);
            return;
        }
        String eta = etaWord(k, d.now), trend = trendWord(k), mon = WidgetData.sgn(k.optDouble("d30")) + " kg bu ay";
        if (!wide && low()) { compact("dusus", "Son 30 gün", KI, trend, eta.isEmpty() ? mon : eta, -1, KI); return; }
        hdr("dusus", "Son 30 gün", KI, MU, null);
        if (!wide) {
            text(trend, 16, 62, 20, db, FG, W - 32);
            spark(k.optJSONArray("pts"), null, 16, 72, W - 32, H - 72 - 30, KI, false);
            text(eta.isEmpty() ? mon : eta, 16, H - 13, 11.5f, fm, MU, W - 32);
            return;
        }
        float lw = 128;
        text(trend, 16, H >= 140 ? 66 : 58, 21, db, FG, lw);
        text(mon, 16, H >= 140 ? 84 : 76, 11.5f, fm, MU, lw);
        String m = monthOf(eta);
        if (!m.isEmpty() && H >= 120) chip("Hedefe " + m, 16, H - 36, 11.5f, KI_S, KI, lw);
        spark(k.optJSONArray("pts"), k.optJSONArray("shots"), 16 + lw + 14, 16, W - lw - 46, H - 32, KI, true);
    }

    private void hedef(WidgetData d, Result r, boolean wide) {
        r.main = "tab/basari";
        bg();
        JSONObject k = d.obj("w");
        if (k == null || !k.has("pct") || k.isNull("pct")) {
            emptyG("hedef", "Hedef kilonu belirle", "Ayarlar'dan ekleyebilirsin", KI);
            r.main = "tab/ayar";
            return;
        }
        float pct = (float) Math.max(0, Math.min(100, k.optDouble("pct")));
        double left = Math.max(0, k.optDouble("left"));
        String big = left <= 0.05 ? "Hedefindesin" : WidgetData.n1(left) + " kg kaldı";
        String m = monthOf(etaWord(k, d.now));
        String sub = "hedef " + WidgetData.n0(k.optDouble("goal")) + " kg" + (m.isEmpty() ? "" : " · " + m);
        if (!wide && low()) { compact("hedef", "Hedef", KI, big, sub, pct / 100f, KI); return; }
        hdr("hedef", "Hedef", KI, MU, null);
        if (!wide) {
            float R = Math.max(30, Math.min(56, Math.min((W - 44) / 2, H - 100)));
            gauge(W / 2, 40, R, pct / 100f);
            textC("%" + Math.round(pct), W / 2, 40 + R - 2, Math.min(22, R * 0.42f), db, FG);
            textC(big, W / 2, H - 30, 16.5f, db, FG);
            textC(sub, W / 2, H - 14, 11.5f, fm, MU);
            return;
        }
        float R = Math.max(30, Math.min(62, H - 72)), cx = 16 + R + 6;
        gauge(cx, 40 + (H - 40 - R - 26) / 2, R, pct / 100f);
        textC("%" + Math.round(pct), cx, 40 + (H - 40 - R - 26) / 2 + R - 2, Math.min(24, R * 0.42f), db, FG);
        float x = cx + R + 24, mw = W - x - 16;
        text(big, x, H >= 150 ? 70 : 62, 24, db, FG, mw);
        text(sub, x, H >= 150 ? 90 : 80, 11.5f, fm, MU, mw);
        JSONObject b = d.obj("badge");
        if (b != null && H >= 150) text("Sıradaki rozet: " + b.optString("t") + " · " + WidgetData.n1(b.optDouble("left")) + " kg", x, H - 18, 11.5f, fb, KI, mw);
    }

    /** Yarım daire gösterge; (cx, top) yayın tepesi. */
    private void gauge(float cx, float top, float R, float f) {
        f = Math.max(0, Math.min(1, f));
        RectF ov = new RectF(cx - R, top, cx + R, top + 2 * R);
        p.setShader(null);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setStrokeWidth(Math.max(7, R * 0.18f));
        p.setColor(TRACK);
        c.drawArc(ov, 180, 180, false, p);
        if (f > 0.005f) {
            p.setColor(KI);
            c.drawArc(ov, 180, 180 * f, false, p);
        }
        p.setStyle(Paint.Style.FILL);
    }

    /** Su ve protein: halkalı küçük, geniş ve alçak düzen. */
    private void ringWidget(Result r, boolean wide, String g, String label, int col, int soft, float f, String inV, String inU, String big, String bigSub, String action, String[][] wideBtns) {
        if (!wide && low()) {
            float s = Math.min(46, H - 26), cx = 14 + s / 2, cy = H / 2;
            ringG(cx, cy, s, 5, f, col, g);
            float x = 14 + s + 10;
            text(big, x, cy + 1, 16, db, FG, W - x - 56);
            text(bigSub, x, cy + 17, 11.5f, fm, MU, W - x - 56);
            plusBtn(r, action, col, onColor());
            return;
        }
        if (!wide) {
            hdr(g, label, col, MU, null);
            float s = Math.max(48, Math.min(78, H - 92)), cx = 16 + s / 2, cy = 40 + s / 2;
            ring(cx, cy, s / 2 - 4, 8, f, col, TRACK);
            textC(inV, cx, cy + 3, s * 0.25f, db, FG);
            textC(inU, cx, cy + 3 + s * 0.2f, 11, fb, MU);
            text(big, 16, H - 30, 15.5f, db, FG, W - 72);
            text(bigSub, 16, H - 14, 11.5f, fm, MU, W - 72);
            plusBtn(r, action, col, onColor());
            return;
        }
        float s = Math.max(60, Math.min(112, H - 36)), cx = 18 + s / 2, cy = H / 2;
        ring(cx, cy, s / 2 - 5, 10, f, col, TRACK);
        textC(inV, cx, cy + 4, s * 0.22f, db, FG);
        textC(inU, cx, cy + 4 + s * 0.17f, 11, fb, MU);
        float x = 18 + s + 20, mw = W - x - 16;
        glyph(g, x, 14, 18, col);
        text(label, x + 23, 27, 12, fb, MU, mw - 23);
        boolean lo = H < 140;
        text(big + " " + bigSub, x, lo ? 56 : 66, lo ? 19 : 24, db, FG, mw);
        if (!lo) bar(x, 78, mw, 6, f, col, TRACK);
        if (H >= 104) buttonsAt(r, x, wideBtns, new int[]{col, soft}, new int[]{onColor(), col});
    }

    private void su(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg();
        double w = d.water(), g = d.waterGoal();
        int cups = (int) Math.ceil(Math.max(0, g - w) / 250.0);
        ringWidget(r, wide, "su", "Su", SU, SU_S, (float) (w / g), WidgetData.n1(w / 1000), "/ " + WidgetData.n1(g / 1000) + " L",
                cups == 0 ? "Tamam" : cups + " bardak", cups == 0 ? "bugünkü hedef" : "kaldı", "water/250",
                new String[][]{{"+1 bardak", "water/250"}, {"+2 bardak", "water/500"}});
    }

    private void protein(WidgetData d, Result r, boolean wide) {
        r.main = "protein";
        bg();
        double pr = d.protein(), g = d.proteinGoal();
        ringWidget(r, wide, "protein", "Protein", PRO, PRO_S, (float) (pr / g), WidgetData.n0(pr), "/ " + WidgetData.n0(g) + " g",
                pr >= g ? "Tamam" : WidgetData.n0(g - pr) + " g", pr >= g ? "bugünkü hedef" : "kaldı", "protein",
                new String[][]{{"+ Protein", "protein"}, {"Ne yesem?", "tab/besin"}});
    }

    private void adim(WidgetData d, Result r, boolean wide) {
        r.main = "tab/adim";
        bg();
        if (!d.hasSteps()) { emptyG("adim", "Adımlarını bağla", "Health Connect ile", AD); return; }
        double st = d.steps(), g = d.stepGoal();
        String big = WidgetData.n0(st), sub = st >= g ? "bugünkü hedef tamam" : WidgetData.n0(g - st) + " adım kaldı";
        if (!wide && low()) { compact("adim", "Adım", AD, big, sub, (float) (st / g), AD); return; }
        hdr("adim", "Adım", AD, MU, null);
        if (!wide) {
            float s = Math.max(56, Math.min(90, H - 72)), cx = W / 2, cy = 38 + s / 2;
            ring(cx, cy, s / 2 - 4, 8, (float) (st / g), AD, TRACK);
            textC(big, cx, cy + 3, Math.min(19, s * 0.22f), db, FG);
            textC("/ " + WidgetData.n0(g), cx, cy + 18, 11, fb, MU);
            textC(sub, cx, H - 14, 11.5f, fm, MU);
            return;
        }
        text(big, 16, H >= 140 ? 76 : 64, 34, db, FG, 150);
        text(sub, 16, H >= 140 ? 94 : 82, 11.5f, fm, MU, 150);
        JSONObject day = d.day();
        JSONArray wk = day != null ? day.optJSONArray("wk") : null;
        if (wk == null || wk.length() == 0) return;
        int n = wk.length();
        float x = 182, mw = W - x - 16, bw = mw / n, top = 18, bh = H - top - 32;
        double mx = g * 1.15;
        for (int i = 0; i < n; i++) mx = Math.max(mx, wk.optDouble(i));
        float gy = top + bh - (float) (g / mx * bh);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(1.4f);
        p.setColor(MU);
        p.setPathEffect(new android.graphics.DashPathEffect(new float[]{4, 4}, 0));
        c.drawLine(x, gy, x + mw, gy, p);
        p.setPathEffect(null);
        p.setStyle(Paint.Style.FILL);
        for (int i = 0; i < n; i++) {
            double v = (i == n - 1 && !d.fresh) ? 0 : wk.optDouble(i);
            float h = (float) Math.max(5, v / mx * bh), bx = x + i * bw + bw * 0.2f, bwi = bw * 0.6f;
            rrect(bx, top + bh - h, bwi, h, Math.min(7, bwi / 2), v >= g ? AD : mix(AD, BG, 0.35f));
            if (i == n - 1) {
                p.setStyle(Paint.Style.STROKE);
                p.setStrokeWidth(2);
                p.setColor(AD);
                c.drawRoundRect(new RectF(bx - 2.5f, top + bh - h - 2.5f, bx + bwi + 2.5f, top + bh + 2.5f), 8, 8, p);
                p.setStyle(Paint.Style.FILL);
            }
        }
        JSONArray lb = day.optJSONArray("wkl");
        if (lb != null) for (int i = 0; i < n && i < lb.length(); i++) textC(lb.optString(i), x + i * bw + bw / 2, H - 12, 9.5f, fm, MU);
    }

    /** Bugünün takviye vakitleri; {slots, sıradaki} */
    private JSONArray suppSlots(WidgetData d) {
        JSONArray days = d.o == null ? null : d.o.optJSONArray("supp");
        if (days != null) for (int i = 0; i < days.length(); i++) {
            JSONObject x = days.optJSONObject(i);
            if (x != null && d.today.equals(x.optString("d"))) return x.optJSONArray("s");
        }
        return null;
    }

    private void takviye(WidgetData d, Result r, boolean wide) {
        r.main = "tab/takviye";
        bg();
        JSONArray slots = suppSlots(d);
        if (slots == null || slots.length() == 0) { emptyG("takviye", "Bugün takviye yok", "programını Hafif'te kur", TK); return; }
        int done = 0, of = 0;
        JSONObject nx = null;
        for (int i = 0; i < slots.length(); i++) {
            JSONObject sl = slots.optJSONObject(i);
            int dn = d.fresh ? sl.optInt("done") : 0;
            done += dn;
            of += sl.optInt("of");
            if (nx == null && dn < sl.optInt("of")) nx = sl;
        }
        String cnt = done + "/" + of;
        if (!wide && low()) {
            compact("takviye", "Takviye", TK, nx == null ? "Hepsi alındı" : nx.optString("n") + " · " + nx.optString("t"), nx == null ? "bugün " + cnt : nx.optString("names"), of == 0 ? -1 : (float) done / of, TK);
            return;
        }
        if (!wide) {
            hdr("takviye", "Takviye", TK, MU, cnt);
            if (nx == null) { text("Hepsi alındı", 16, 72, 20, db, FG, W - 32); text("bugün " + cnt, 16, 90, 11.5f, fm, MU, W - 32); return; }
            text(nx.optString("n") + " · " + nx.optString("t"), 16, 62, 17, db, FG, W - 32);
            String[] names = nx.optString("names").split(" · ");
            int rows = H >= 160 ? 2 : 1;
            float y = 84;
            for (int i = 0; i < Math.min(rows, names.length); i++) {
                p.setStyle(Paint.Style.STROKE);
                p.setStrokeWidth(2);
                p.setColor(TK);
                c.drawCircle(23, y - 4, 6, p);
                p.setStyle(Paint.Style.FILL);
                text(names[i], 36, y, 13, fb, FG, W - 52);
                y += 20;
            }
            if (names.length > rows) text("+" + (names.length - rows) + " daha", 36, y - 2, 11, fm, MU, W - 52);
            buttons(r, new String[][]{{"Hepsini aldım", "supp/" + nx.optString("k")}}, new int[]{TK_S}, new int[]{TK});
            return;
        }
        hdr("takviye", "Takviyeler", TK, MU, "Bugün " + cnt);
        if (H < 150) {
            text(nx == null ? "Hepsi alındı" : nx.optString("n") + " · " + nx.optString("t"), 16, 60, 17, db, FG, W - 32);
            if (nx != null) text(nx.optString("names"), 16, 78, 11.5f, fm, MU, W - 32);
            if (nx != null && H >= 120) buttons(r, new String[][]{{nx.optString("n") + " takviyelerini aldım", "supp/" + nx.optString("k")}}, new int[]{TK_S}, new int[]{TK});
            return;
        }
        int n = Math.min(4, slots.length());
        int a = 0;
        if (slots.length() > 4 && nx != null) for (int i = 0; i < slots.length(); i++) if (slots.optJSONObject(i) == nx) { a = Math.max(0, Math.min(i - 1, slots.length() - 4)); break; }
        float gap = 8, cw = (W - 32 - gap * (n - 1)) / n, y = 40, ch = H - y - 14;
        for (int j = 0; j < n; j++) {
            JSONObject sl = slots.optJSONObject(a + j);
            float x = 16 + j * (cw + gap);
            boolean ok = d.fresh && sl.optInt("done") >= sl.optInt("of"), isNx = sl == nx;
            rrect(x, y, cw, ch, 16, isNx ? TK_S : WL);
            if (isNx) {
                p.setStyle(Paint.Style.STROKE);
                p.setStrokeWidth(1.6f);
                p.setColor(TK);
                c.drawRoundRect(new RectF(x + 0.8f, y + 0.8f, x + cw - 0.8f, y + ch - 0.8f), 15, 15, p);
                p.setStyle(Paint.Style.FILL);
            }
            text(sl.optString("n"), x + 10, y + 22, 13.5f, db, FG, cw - 34);
            float kx = x + cw - 17, ky = y + 17;
            if (ok) {
                p.setColor(TK);
                c.drawCircle(kx, ky, 8, p);
                check(kx, ky, 3.6f, onColor());
            } else {
                p.setStyle(Paint.Style.STROKE);
                p.setStrokeWidth(2);
                p.setColor(isNx ? TK : TRACK);
                c.drawCircle(kx, ky, 7, p);
                p.setStyle(Paint.Style.FILL);
            }
            text(sl.optString("t"), x + 10, y + 40, 11, fm, MU, cw - 20);
            wrap(sl.optString("names"), x + 10, y + 58, cw - 20, 11, fb, FG, Math.max(1, (int) ((ch - 62) / 15)));
        }
    }

    private void check(float cx, float cy, float a, int col) {
        Path pa = new Path();
        pa.moveTo(cx - a, cy);
        pa.lineTo(cx - a * 0.25f, cy + a * 0.75f);
        pa.lineTo(cx + a, cy - a * 0.7f);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(2);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setStrokeJoin(Paint.Join.ROUND);
        p.setColor(col);
        c.drawPath(pa, p);
        p.setStyle(Paint.Style.FILL);
    }

    /** Ne yesem?: saate göre öğün önerisi; + Ekle proteini uygulamada ekler. */
    private void yemek(WidgetData d, Result r, boolean wide) {
        r.main = "tab/besin";
        bg();
        JSONObject ms = d.obj("meals");
        double rem = d.proteinGoal() - d.protein();
        if (ms == null) { emptyG("tencere", "Hafif'i bir kez aç", "öneriler hazırlansın", PRO); return; }
        if (rem < 10) { emptyG("protein", "Bugünkü protein tamam", "yarın yeni önerilerle", PRO); return; }
        int h = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY);
        String slot = h < 11 ? "k" : h >= 21 ? "a" : "o";
        String lbl = slot.equals("k") ? "Kahvaltı" : slot.equals("a") ? "Hafif bir şey" : h < 16 ? "Öğle" : "Akşam";
        JSONArray L = ms.optJSONArray(slot);
        JSONObject m = L == null || L.length() == 0 ? null : L.optJSONObject(0);
        if (m == null) { emptyG("tencere", "Öneri yok", "Hafif'i açınca yenilenir", PRO); return; }
        String act = "meal/" + m.optString("id"), g = "+" + m.optInt("g") + " g protein";
        if (!wide && low()) { compact("tencere", "Ne yesem?", PRO, m.optString("s"), g, -1, PRO); return; }
        if (!wide) {
            glyph("tencere", 16, 14, 18, PRO);
            text("Ne yesem? · " + lbl, 39, 27, 12, fb, PRO, W - 55);
            wrap(m.optString("s"), 16, 64, W - 32, 17, db, FG, 2);
            text(g, 16, H - 26, 11.5f, fb, MU, W - 72);
            plusBtn(r, act, PRO, onColor());
            return;
        }
        float pd = Math.min(H - 32, 124), px = 16, py = (H - pd) / 2;
        p.setShader(null);
        p.setColor(PRO_S);
        c.drawCircle(px + pd / 2, py + pd / 2, pd / 2, p);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(pd * 0.075f);
        p.setColor(mix(PRO, BG, 0.16f));
        c.drawCircle(px + pd / 2, py + pd / 2, pd / 2 - pd * 0.0375f, p);
        p.setStyle(Paint.Style.FILL);
        glyphC("tencere", px + pd * 0.42f, py + pd * 0.5f, pd * 0.4f, PRO);
        glyphC("salata", px + pd * 0.7f, py + pd * 0.64f, pd * 0.28f, mix(PRO, FG, 0.7f));
        float x = px + pd + 18, mw = W - x - 16;
        text("Ne yesem? · " + lbl, x, 28, 12, fb, PRO, mw);
        if (H < 140) text(m.optString("n"), x, 54, 16, db, FG, mw);
        else {
            wrap(m.optString("n"), x, 54, mw, 18, db, FG, 2);
            text(g + " · " + WidgetData.n0(rem) + " g kaldı", x, 98, 11.5f, fm, MU, mw);
        }
        buttonsAt(r, x, new String[][]{{"+ Ekle", act}, {"Başka öner", "tab/besin"}}, new int[]{PRO, PRO_S}, new int[]{onColor(), PRO});
    }

    /** 4×4 Pano: üst yarı zümrüt (kilo yolu), alt yarı bugünün halkaları ve sıradaki iki şey. Dokunma bölgeleri r.zones. */
    private void pano(WidgetData d, Result r) {
        r.main = "tab/ozet";
        bg();
        float top = H * 0.51f;
        zbg(0, 0, W, top, 24, 0);
        JSONObject k = d.obj("w");
        glyph("yaprak", 16, 14, 18, MINT);
        text("Hafif", 39, 27, 12, fb, MINT, 100);
        textR(WidgetData.todayLong(d.now), W - 16, 27, 11.5f, fm, ZM);
        if (k == null) {
            text("İlk tartını gir", 16, top * 0.6f, 22, db, WHITE, W - 32);
            text("kilo yolun burada görünecek", 16, top * 0.6f + 20, 12, fm, ZM, W - 32);
        } else {
            float bs = Math.min(46, top * 0.26f), by = 36 + bs;
            float tw = text(WidgetData.n1(k.optDouble("cur")), 16, by, bs, db, WHITE, W * 0.5f);
            float tw2 = text(" kg", 16 + tw, by, 14, fb, ZM, 30);
            float cx0 = 16 + tw + tw2 + 10;
            chip(WidgetData.sgn(k.optDouble("change")) + " kg başından", cx0, by - 22, 11.5f, 0x299FF0D6, MINT, W - cx0 - 16);
            float sy = by + 10, sh = top - 34 - sy;
            if (sh > 16) spark(k.optJSONArray("pts"), null, 16, sy, W - 32, sh, MINT, false);
            if (k.has("pct") && !k.isNull("pct")) {
                double left = Math.max(0, k.optDouble("left"));
                String m = monthOf(etaWord(k, d.now));
                String lt = left <= 0.05 ? "Hedefindesin" : "Hedefe " + WidgetData.n1(left) + " kg" + (m.isEmpty() ? "" : " · " + m);
                tp.setTypeface(fb);
                tp.setTextSize(11.5f);
                tp.setLetterSpacing(0);
                float lw = tp.measureText(lt);
                textR(lt, W - 16, top - 15, 11.5f, fb, WHITE);
                bar(16, top - 21, Math.max(30, W - 32 - lw - 14), 5, (float) (k.optDouble("pct") / 100), MINT, 0x24FFFFFF);
            } else text(trendWord(k), 16, top - 15, 11.5f, fb, WHITE, W - 32);
        }
        // bugün: üç halka; köşedeki + o kaydı açar
        double w = d.water(), wg = d.waterGoal(), pr = d.protein(), pg = d.proteinGoal(), st = d.steps(), sg = d.stepGoal();
        boolean hs = d.hasSteps();
        String[] gk = {"protein", "su", "adim"};
        int[] col = {PRO, SU, AD};
        float[] f = {(float) (pr / pg), (float) (w / wg), hs ? (float) (st / sg) : 0};
        String[] val = {WidgetData.n0(pr), WidgetData.n1(w / 1000), hs ? WidgetData.n0(st) : "–"};
        String[] unit = {"/ " + WidgetData.n0(pg) + " g", "/ " + WidgetData.n1(wg / 1000) + " L", hs ? "adım" : "bağla"};
        float rz = H * 0.29f, s = Math.max(36, Math.min(56, rz - 36)), cy = top + 12 + s / 2;
        for (int i = 0; i < 3; i++) {
            float cx = W * (2 * i + 1) / 6f;
            ringG(cx, cy, s, 6, f[i], col[i], gk[i]);
            float bx = cx + s * 0.36f, byy = cy + s * 0.36f;
            p.setShader(null);
            p.setColor(BG);
            c.drawCircle(bx, byy, 11.5f, p);
            p.setColor(col[i]);
            c.drawCircle(bx, byy, 10, p);
            plusMark(bx, byy, 4.2f, onColor(), 2);
            valueC(val[i], unit[i], cx, cy + s / 2 + 19, 15, 11);
        }
        // sıradaki iki şey
        float y0 = top + rz, chh = Math.max(34, H - y0 - 14), cw = (W - 32 - 8) / 2;
        String z4, z5;
        if (d.shots() && d.cyc() != null && d.nextTs() > 0) {
            JSONObject n = d.next();
            String site = n == null ? "" : n.optString("site", "").toLowerCase(WidgetData.TR);
            miniCard(16, y0, cw, chh, "igne", IG, IG_S, dayWord(d) + " " + hm(d.nextTs()), site.isEmpty() ? "sıradaki iğne" : site);
            z4 = "shot";
        } else {
            JSONObject ms = d.obj("meals");
            int hh = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY);
            JSONArray L = ms == null ? null : ms.optJSONArray(hh < 11 ? "k" : hh >= 21 ? "a" : "o");
            JSONObject m = L == null || L.length() == 0 || pg - pr < 10 ? null : L.optJSONObject(0);
            if (m != null) { miniCard(16, y0, cw, chh, "tencere", PRO, PRO_S, m.optString("s"), "+" + m.optInt("g") + " g protein"); z4 = "meal/" + m.optString("id"); }
            else { miniCard(16, y0, cw, chh, "yaprak", KI, KI_S, "Ne yesem?", "öneriler Günlük'te"); z4 = "tab/besin"; }
        }
        JSONArray slots = suppSlots(d);
        JSONObject nx = null;
        int done = 0, of = 0;
        if (slots != null) for (int i = 0; i < slots.length(); i++) {
            JSONObject sl = slots.optJSONObject(i);
            int dn = d.fresh ? sl.optInt("done") : 0;
            done += dn;
            of += sl.optInt("of");
            if (nx == null && dn < sl.optInt("of")) nx = sl;
        }
        if (of > 0) {
            miniCard(16 + cw + 8, y0, cw, chh, "takviye", TK, TK_S, nx == null ? "Hepsi alındı" : nx.optString("n") + " " + nx.optString("t"), nx == null ? "bugün " + done + "/" + of : nx.optInt("of") + " takviye");
            z5 = "tab/takviye";
        } else if (k != null && k.has("pct") && !k.isNull("pct")) {
            miniCard(16 + cw + 8, y0, cw, chh, "hedef", KI, KI_S, WidgetData.n1(Math.max(0, k.optDouble("left"))) + " kg kaldı", "hedefe");
            z5 = "tab/basari";
        } else {
            miniCard(16 + cw + 8, y0, cw, chh, "dusus", KI, KI_S, "Kilo gir", "bugünkü tartın");
            z5 = "weight";
        }
        r.zones = new String[]{"tab/kilo", "protein", "water/250", hs ? "tab/adim" : "tab/adim", z4, z5};
    }

    private void miniCard(float x, float y, float w, float h, String g, int col, int soft, String title, String sub) {
        rrect(x, y, w, h, 14, soft);
        glyph(g, x + 10, y + h / 2 - 8, 20, col);
        text(title, x + 37, y + h / 2 - 1, 13.5f, db, FG, w - 45);
        text(sub, x + 37, y + h / 2 + 14, 11, fm, MU, w - 45);
    }

    // ---------- ikonlar ----------
    private static final java.util.HashMap<String, Path> GP = new java.util.HashMap<>();

    /** Noto Emoji (tek renk) çizimi; (x, y) sol üst, yükseklik genişliğin 0,8'i. */
    private void glyph(String k, float x, float y, float w, int col) {
        Path src = GP.get(k);
        if (src == null) {
            String dd = WidgetGlyphs.get(k);
            if (dd == null) return;
            try { src = androidx.core.graphics.PathParser.createPathFromPathData(dd); } catch (Exception e) { return; }
            if (src == null) return;
            GP.put(k, src);
        }
        float sc = w / 2600f;
        android.graphics.Matrix m = new android.graphics.Matrix();
        m.setScale(sc, -sc);
        m.postTranslate(x, y + 1740 * sc);
        Path t = new Path(src);
        t.transform(m);
        p.setShader(null);
        p.setStyle(Paint.Style.FILL);
        p.setColor(col);
        c.drawPath(t, p);
    }

    private void glyphC(String k, float cx, float cy, float w, int col) { glyph(k, cx - w / 2, cy - w * 0.4f, w, col); }

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
