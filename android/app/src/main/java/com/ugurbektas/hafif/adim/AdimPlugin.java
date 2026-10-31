package com.ugurbektas.hafif.adim;

import android.Manifest;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import org.json.JSONArray;

/** Health Connect'e adım gelmeyen telefonlarda yedek kaynak: telefonun kendi adım sayacı. */
@CapacitorPlugin(name = "HafifAdim", permissions = { @Permission(alias = "adim", strings = { Manifest.permission.ACTIVITY_RECOGNITION }) })
public class AdimPlugin extends Plugin {

    private boolean izinVar() {
        // Android 9 ve öncesinde adım sayacı için çalışma zamanı izni yok
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.Q || getPermissionState("adim") == PermissionState.GRANTED;
    }

    @Override
    public void load() {
        if (AdimSayar.acik(getContext()) && izinVar()) AdimAlarm.kur(getContext());
    }

    @PluginMethod
    public void durum(PluginCall call) {
        JSObject r = new JSObject();
        r.put("sensor", AdimSayar.sensorVar(getContext()));
        r.put("izin", izinVar());
        r.put("acik", AdimSayar.acik(getContext()));
        call.resolve(r);
    }

    @PluginMethod
    public void baslat(PluginCall call) {
        if (!AdimSayar.sensorVar(getContext())) { call.reject("Bu telefonda adım sayacı yok", "sensor-yok"); return; }
        if (izinVar()) { ac(call); return; }
        requestPermissionForAlias("adim", call, "izinSonuc");
    }

    @PermissionCallback
    private void izinSonuc(PluginCall call) {
        if (izinVar()) ac(call);
        else call.reject("Fiziksel aktivite izni verilmedi", "izin-yok");
    }

    private void ac(PluginCall call) {
        AdimSayar.acikYap(getContext(), true);
        AdimAlarm.kur(getContext());
        getBridge().execute(() -> { AdimSayar.ornekle(getContext(), 3000); call.resolve(); });
    }

    @PluginMethod
    public void durdur(PluginCall call) {
        AdimSayar.acikYap(getContext(), false);
        AdimAlarm.kaldir(getContext());
        call.resolve();
    }

    /** Sayacı hemen okur, ardından günlük ve bugünün saatlik adımlarını döndürür. */
    @PluginMethod
    public void oku(PluginCall call) {
        if (!AdimSayar.acik(getContext()) || !izinVar()) { call.reject("kapalı", "kapali"); return; }
        getBridge().execute(() -> {
            AdimSayar.ornekle(getContext(), 3000);
            JSObject r = new JSObject();
            try { r.put("gunler", new JSObject(AdimSayar.gunler(getContext()).toString())); } catch (Exception e) { r.put("gunler", new JSObject()); }
            JSONArray h = AdimSayar.bugununSaatleri(getContext());
            if (h != null) r.put("saatler", h);
            call.resolve(r);
        });
    }
}
