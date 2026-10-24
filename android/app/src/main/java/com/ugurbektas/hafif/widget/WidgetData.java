package com.ugurbektas.hafif.widget;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/** Uygulamanın yazdığı files/widget.json'u okur; zamana bağlı değerleri (evre, mg, kalan gün) o anki saate göre hesaplar. */
final class WidgetData {
    static final Locale TR = new Locale("tr", "TR");
    final JSONObject o;
    final long now;
    final String today;
    final boolean fresh; // anlık görüntü bugüne mi ait (su, protein, adım günlük sıfırlanır)

    private WidgetData(JSONObject o, long now) {
        this.o = o;
        this.now = now;
        this.today = ymd(now);
        this.fresh = o != null && today.equals(o.optString("date"));
    }

    static WidgetData load(Context ctx) {
        JSONObject o = null;
        try {
            File f = new File(ctx.getFilesDir(), "widget.json");
            if (f.exists()) {
                byte[] b = new byte[(int) f.length()];
                try (FileInputStream in = new FileInputStream(f)) {
                    int off = 0;
                    while (off < b.length) {
                        int r = in.read(b, off, b.length - off);
                        if (r < 0) break;
                        off += r;
                    }
                }
                o = new JSONObject(new String(b, StandardCharsets.UTF_8));
            }
        } catch (Exception ignored) {
        }
        return new WidgetData(o, System.currentTimeMillis());
    }

    boolean has() { return o != null; }

    Boolean forcePlus; // önizleme üretirken

    boolean plus() {
        if (forcePlus != null) return forcePlus;
        if (o == null) return false;
        return now < o.optLong("plusUntil", 0);
    }

    boolean shots() { return o != null && o.optBoolean("shots", false); }

    JSONObject obj(String k) { return o == null ? null : o.optJSONObject(k); }

    // ---------- döngü ----------
    JSONObject cyc() { return obj("cyc"); }

    /** Bugünkü evrenin sırası (0-5); iğne günü geçtiyse 5. */
    int phase() {
        JSONObject c = cyc();
        if (c == null) return -1;
        double el = (now - c.optLong("t0")) / 864e5;
        JSONArray e = c.optJSONArray("ends");
        if (e == null) return -1;
        for (int i = 0; i < e.length(); i++) if (el < e.optDouble(i)) return i;
        return 5;
    }

    boolean overdue() {
        JSONObject c = cyc();
        return c != null && now > c.optLong("tn") + 6 * 3600_000L;
    }

    String phaseName() {
        JSONObject c = cyc();
        int i = phase();
        if (c == null || i < 0) return "";
        return c.optJSONArray("ph").optString(i);
    }

    String phaseTip() {
        JSONObject c = cyc();
        int i = phase();
        if (c == null || i < 0) return "";
        if (overdue()) return "İğne zamanı geçti. Yaptıysan Hafif'e eklemeyi unutma.";
        return c.optJSONArray("tip").optString(i);
    }

    /** Döngünün ne kadarı geçti (0-1). */
    float cycleFrac() {
        JSONObject c = cyc();
        if (c == null) return 0;
        double tot = Math.max(1, c.optLong("tn") - c.optLong("t0"));
        return (float) Math.max(0, Math.min(1, (now - c.optLong("t0")) / tot));
    }

    int cycleDay() {
        JSONObject c = cyc();
        if (c == null) return 0;
        return (int) Math.floor((now - c.optLong("t0")) / 864e5) + 1;
    }

    int cycleDays() {
        JSONObject c = cyc();
        return c == null ? 7 : c.optInt("days", 7);
    }

    /** Vücuttaki tahmini mg (saatlik ön hesaptan doğrusal ara değer). */
    double mg() {
        JSONObject c = cyc();
        if (c == null) return 0;
        JSONArray lv = c.optJSONArray("lv");
        if (lv == null || lv.length() == 0) return 0;
        double k = (now - c.optLong("lvT0")) / 3600_000.0;
        if (k <= 0) return lv.optDouble(0);
        if (k >= lv.length() - 1) return lv.optDouble(lv.length() - 1);
        int i = (int) Math.floor(k);
        double f = k - i;
        return lv.optDouble(i) * (1 - f) + lv.optDouble(i + 1) * f;
    }

    // ---------- sıradaki iğne ----------
    JSONObject next() { return obj("next"); }

    long nextTs() {
        JSONObject n = next();
        return n == null ? 0 : n.optLong("ts");
    }

    /** "3 gün", "Yarın", "Bugün", "Gecikti". */
    String leftText() {
        long ts = nextTs();
        if (ts == 0) return "–";
        int d = dayDiff(now, ts);
        if (ts < now - 6 * 3600_000L) return "Gecikti";
        if (d <= 0) return "Bugün";
        if (d == 1) return "Yarın";
        return d + " gün";
    }

    String nextWhen() {
        long ts = nextTs();
        if (ts == 0) return "";
        SimpleDateFormat f = new SimpleDateFormat("EEE HH:mm", TR);
        return cap(f.format(new Date(ts)));
    }

    String nextWhenLong() {
        long ts = nextTs();
        if (ts == 0) return "";
        SimpleDateFormat f = new SimpleDateFormat("EEEE · HH:mm", TR);
        return cap(f.format(new Date(ts)));
    }

    // ---------- gün ----------
    JSONObject day() { return obj("day"); }

    double water() { JSONObject d = day(); return d == null || !fresh ? 0 : d.optDouble("w"); }
    double waterGoal() { JSONObject d = day(); return d == null ? 2500 : d.optDouble("wg", 2500); }
    double protein() { JSONObject d = day(); return d == null || !fresh ? 0 : d.optDouble("p"); }
    double proteinGoal() { JSONObject d = day(); return d == null ? 100 : d.optDouble("pg", 100); }
    boolean hasSteps() { JSONObject d = day(); return d != null && d.has("st") && !d.isNull("st"); }
    double steps() { JSONObject d = day(); return d == null || !fresh ? 0 : d.optDouble("st"); }
    double stepGoal() { JSONObject d = day(); return d == null ? 7500 : d.optDouble("sg", 7500); }

    // ---------- yardımcılar ----------
    static String ymd(long t) {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date(t));
    }

    static int dayDiff(long a, long b) {
        Calendar ca = Calendar.getInstance(), cb = Calendar.getInstance();
        ca.setTimeInMillis(a);
        cb.setTimeInMillis(b);
        ca.set(Calendar.HOUR_OF_DAY, 12); ca.set(Calendar.MINUTE, 0);
        cb.set(Calendar.HOUR_OF_DAY, 12); cb.set(Calendar.MINUTE, 0);
        return (int) Math.round((cb.getTimeInMillis() - ca.getTimeInMillis()) / 864e5);
    }

    static String cap(String s) {
        if (s == null || s.isEmpty()) return "";
        return s.substring(0, 1).toUpperCase(TR) + s.substring(1);
    }

    static String n0(double v) {
        NumberFormat f = NumberFormat.getIntegerInstance(TR);
        return f.format(Math.round(v));
    }

    static String n1(double v) {
        NumberFormat f = NumberFormat.getNumberInstance(TR);
        f.setMinimumFractionDigits(1);
        f.setMaximumFractionDigits(1);
        return f.format(v);
    }

    /** −1,2 / +0,4 / ±0,0 (kg). */
    static String sgn(double v) {
        String s = n1(Math.abs(v));
        if (Math.abs(v) < 0.05) return "±" + s;
        return (v < 0 ? "−" : "+") + s;
    }

    static String todayLong(long now) {
        return cap(new SimpleDateFormat("EEEE d MMMM", TR).format(new Date(now)));
    }
}
