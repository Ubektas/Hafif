package com.ugurbektas.hafif.adim;

import android.content.Context;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.SystemClock;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.Locale;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Telefonun donanım adım sayacı (TYPE_STEP_COUNTER). Sayaç yalnızca "açılıştan beri toplam adım" tutar;
 * Hafif bunu aralıklarla okuyup aradaki farkı o günün ve o saatin hanesine yazar. Yeniden başlatmada sayaç
 * sıfırlandığı için fark, yeni sayacın kendisidir. Veriler yalnızca bu telefondaki SharedPreferences'ta kalır.
 */
public final class AdimSayar {
    private static final String PREFS = "hafif_adim";
    private static final int GUN_SAKLA = 90;
    private static final int TEK_SEFERDE_EN_FAZLA = 60000;

    private AdimSayar() {}

    public static boolean sensorVar(Context c) {
        SensorManager sm = (SensorManager) c.getSystemService(Context.SENSOR_SERVICE);
        return sm != null && sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) != null;
    }

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static boolean acik(Context c) {
        return prefs(c).getBoolean("acik", false);
    }

    public static void acikYap(Context c, boolean v) {
        prefs(c).edit().putBoolean("acik", v).apply();
    }

    /** Sayacın şu anki değerini en fazla beklemeMs kadar bekleyerek okur; okunamazsa -1. Ana iş parçacığında çağrılmamalı. */
    static float sayacOku(Context c, long beklemeMs) {
        SensorManager sm = (SensorManager) c.getSystemService(Context.SENSOR_SERVICE);
        Sensor s = sm == null ? null : sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        if (s == null) return -1;
        final float[] v = { -1 };
        final CountDownLatch l = new CountDownLatch(1);
        HandlerThread t = new HandlerThread("hafif-adim");
        t.start();
        SensorEventListener d = new SensorEventListener() {
            @Override public void onSensorChanged(SensorEvent e) { v[0] = e.values[0]; l.countDown(); }
            @Override public void onAccuracyChanged(Sensor sensor, int a) {}
        };
        try {
            if (!sm.registerListener(d, s, SensorManager.SENSOR_DELAY_NORMAL, new Handler(t.getLooper()))) return -1;
            l.await(beklemeMs, TimeUnit.MILLISECONDS);
        } catch (SecurityException | InterruptedException ignored) {
        } finally {
            sm.unregisterListener(d);
            t.quitSafely();
        }
        return v[0];
    }

    static String gun(long ms) {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date(ms));
    }

    /** Sayacı okur ve aradaki farkı kaydeder. */
    public static synchronized void ornekle(Context c, long beklemeMs) {
        float sayac = sayacOku(c, beklemeMs);
        if (sayac < 0) return;
        SharedPreferences p = prefs(c);
        long simdi = System.currentTimeMillis();
        long acilis = simdi - SystemClock.elapsedRealtime();
        float son = p.getFloat("son", -1);
        long sonAcilis = p.getLong("acilis", 0);
        int fark;
        if (son < 0) fark = 0; // ilk okuma: yalnızca başlangıç noktası
        else if (Math.abs(acilis - sonAcilis) > 120000 || sayac < son) fark = Math.round(sayac); // yeniden başlatıldı
        else fark = Math.round(sayac - son);
        if (fark < 0 || fark > TEK_SEFERDE_EN_FAZLA) fark = 0;
        SharedPreferences.Editor e = p.edit().putFloat("son", sayac).putLong("acilis", acilis);
        if (fark > 0) {
            try {
                String g = gun(simdi);
                JSONObject gunler = new JSONObject(p.getString("gunler", "{}"));
                gunler.put(g, gunler.optInt(g, 0) + fark);
                String sinir = gun(simdi - GUN_SAKLA * 86400000L);
                for (Iterator<String> it = gunler.keys(); it.hasNext();) if (it.next().compareTo(sinir) < 0) it.remove();
                JSONObject saat = new JSONObject(p.getString("saatler", "{}"));
                JSONArray h = g.equals(saat.optString("gun")) ? saat.optJSONArray("h") : null;
                if (h == null || h.length() != 24) { h = new JSONArray(); for (int i = 0; i < 24; i++) h.put(0); }
                int hh = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
                h.put(hh, h.optInt(hh, 0) + fark);
                saat.put("gun", g).put("h", h);
                e.putString("gunler", gunler.toString()).putString("saatler", saat.toString());
            } catch (Exception ignored) {}
        }
        e.apply();
    }

    public static JSONObject gunler(Context c) {
        try { return new JSONObject(prefs(c).getString("gunler", "{}")); } catch (Exception e) { return new JSONObject(); }
    }

    /** Bugünün saatlik adımları; bugün kayıt yoksa null. */
    public static JSONArray bugununSaatleri(Context c) {
        try {
            JSONObject s = new JSONObject(prefs(c).getString("saatler", "{}"));
            return gun(System.currentTimeMillis()).equals(s.optString("gun")) ? s.optJSONArray("h") : null;
        } catch (Exception e) { return null; }
    }
}
