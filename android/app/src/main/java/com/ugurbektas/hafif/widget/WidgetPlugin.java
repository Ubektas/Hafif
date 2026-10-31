package com.ugurbektas.hafif.widget;

import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import androidx.core.content.FileProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import android.view.Window;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;

/** Uygulama veri dosyasını (files/widget.json) yazdıktan sonra widget'ları yeniler. */
@CapacitorPlugin(name = "HafifWidget")
public class WidgetPlugin extends Plugin {
    @PluginMethod
    public void refresh(PluginCall call) {
        try {
            HafifWidgets.updateAll(getContext());
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void preview(PluginCall call) {
        try {
            JSObject r = new JSObject();
            r.put("files", HafifWidgets.preview(getContext()));
            call.resolve(r);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    /** Uygulamanın kendi teması (Sistem/Açık/Koyu) ile durum ve gezinme çubuğu simgelerinin rengini eşler. */
    @PluginMethod
    public void bars(PluginCall call) {
        final boolean dark = Boolean.TRUE.equals(call.getBoolean("dark", false));
        getActivity().runOnUiThread(() -> {
            try {
                Window w = getActivity().getWindow();
                WindowInsetsControllerCompat c = WindowCompat.getInsetsController(w, w.getDecorView());
                c.setAppearanceLightStatusBars(!dark);
                c.setAppearanceLightNavigationBars(!dark);
                // çubukların arkasında görünen pencere zemini temayla aynı renk olsun (yoksa koyu temada beyaz şerit kalır)
                int bg = dark ? 0xFF08171A : 0xFFF1F5F3;
                w.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(bg));
                w.getDecorView().setBackgroundColor(bg);
                if (getBridge() != null && getBridge().getWebView() != null) getBridge().getWebView().setBackgroundColor(bg);
                call.resolve();
            } catch (Exception e) {
                call.reject(e.getMessage());
            }
        });
    }

    /**
     * "Hafif ekibine gönder": alıcısı, konusu, metni dolu ve görseli ekli e-posta.
     * Seçici-filtreli paylaşım (setSelector) bazı Samsung telefonlarda "Bu eylemi hiçbir uygulama gerçekleştiremez"
     * diyor; bu yüzden mailto açabilen uygulamalar tek tek bulunup her birine paketli ACTION_SEND hazırlanır.
     * Ek kabul eden uygulama yoksa görselsiz mailto taslağı açılır.
     */
    @PluginMethod
    public void email(PluginCall call) {
        try {
            android.content.pm.PackageManager pm = getContext().getPackageManager();
            String to = call.getString("to", ""), subject = call.getString("subject", ""), body = call.getString("body", "");
            File f = new File(getContext().getCacheDir(), call.getString("path", ""));
            Uri uri = f.exists() ? FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f) : null;
            java.util.List<android.content.pm.ResolveInfo> mailApps = pm.queryIntentActivities(new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:")), 0);
            java.util.ArrayList<Intent> targets = new java.util.ArrayList<>();
            java.util.HashSet<String> seen = new java.util.HashSet<>();
            for (android.content.pm.ResolveInfo ri : mailApps) {
                String pkg = ri.activityInfo.packageName;
                if (!seen.add(pkg)) continue;
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType(uri != null ? "image/png" : "text/plain");
                send.putExtra(Intent.EXTRA_EMAIL, new String[] { to });
                send.putExtra(Intent.EXTRA_SUBJECT, subject);
                send.putExtra(Intent.EXTRA_TEXT, body);
                if (uri != null) {
                    send.putExtra(Intent.EXTRA_STREAM, uri);
                    send.setClipData(ClipData.newRawUri("", uri));
                    send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                }
                send.setPackage(pkg);
                if (send.resolveActivity(pm) != null) targets.add(send);
            }
            Intent open;
            if (targets.isEmpty()) {
                if (mailApps.isEmpty()) { call.reject("e-posta uygulaması yok"); return; }
                // ek kabul eden yok: görselsiz taslak
                open = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:" + Uri.encode(to) + "?subject=" + Uri.encode(subject) + "&body=" + Uri.encode(body)));
            } else if (targets.size() == 1) {
                open = targets.get(0);
            } else {
                open = Intent.createChooser(targets.remove(0), "E-posta uygulamanı seç");
                open.putExtra(Intent.EXTRA_INITIAL_INTENTS, targets.toArray(new android.os.Parcelable[0]));
            }
            open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(open);
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }
}
