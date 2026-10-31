package com.ugurbektas.hafif.adim;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import java.util.concurrent.TimeUnit;

/** 15 dakikada bir sayacı okur; böylece gece yarısı ve yeniden başlatmalar arasındaki adımlar doğru güne yazılır. */
public class AdimWorker extends Worker {
    private static final String AD = "hafif-adim";

    public AdimWorker(@NonNull Context c, @NonNull WorkerParameters p) { super(c, p); }

    @NonNull
    @Override
    public Result doWork() {
        if (AdimSayar.acik(getApplicationContext())) AdimSayar.ornekle(getApplicationContext(), 8000);
        return Result.success();
    }

    public static void kur(Context c) {
        PeriodicWorkRequest r = new PeriodicWorkRequest.Builder(AdimWorker.class, 15, TimeUnit.MINUTES).build();
        WorkManager.getInstance(c).enqueueUniquePeriodicWork(AD, ExistingPeriodicWorkPolicy.KEEP, r);
    }

    public static void kaldir(Context c) {
        WorkManager.getInstance(c).cancelUniqueWork(AD);
    }
}
