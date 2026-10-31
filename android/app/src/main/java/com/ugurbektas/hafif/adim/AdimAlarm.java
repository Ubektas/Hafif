package com.ugurbektas.hafif.adim;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;

/**
 * 15 dakikada bir (telefon uyanıkken, esnek zamanlı) sayacı okur; böylece gece yarısı ve yeniden başlatmalar
 * arasındaki adımlar doğru güne yazılır. Telefon yeniden başlayınca zamanlayıcıyı yeniden kurar.
 */
public class AdimAlarm extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        final Context app = c.getApplicationContext();
        if (!AdimSayar.acik(app)) return;
        if (Intent.ACTION_BOOT_COMPLETED.equals(i.getAction())) kur(app);
        final PendingResult r = goAsync();
        new Thread(() -> {
            try { AdimSayar.ornekle(app, 6000); } finally { r.finish(); }
        }).start();
    }

    private static PendingIntent pi(Context c) {
        return PendingIntent.getBroadcast(c, 4100, new Intent(c, AdimAlarm.class), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    public static void kur(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        am.setInexactRepeating(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime() + AlarmManager.INTERVAL_FIFTEEN_MINUTES,
            AlarmManager.INTERVAL_FIFTEEN_MINUTES, pi(c));
    }

    public static void kaldir(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(pi(c));
    }
}
