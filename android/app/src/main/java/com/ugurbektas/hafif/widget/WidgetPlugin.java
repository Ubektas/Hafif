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

    /** "Hafif ekibine gönder": alıcısı, konusu, metni dolu ve görseli ekli e-posta; yalnızca e-posta uygulamaları listelenir. */
    @PluginMethod
    public void email(PluginCall call) {
        try {
            Intent mail = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:"));
            if (mail.resolveActivity(getContext().getPackageManager()) == null) {
                call.reject("e-posta uygulaması yok");
                return;
            }
            String to = call.getString("to", "");
            File f = new File(getContext().getCacheDir(), call.getString("path", ""));
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("image/png");
            send.putExtra(Intent.EXTRA_EMAIL, new String[] { to });
            send.putExtra(Intent.EXTRA_SUBJECT, call.getString("subject", ""));
            send.putExtra(Intent.EXTRA_TEXT, call.getString("body", ""));
            if (f.exists()) {
                Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f);
                send.putExtra(Intent.EXTRA_STREAM, uri);
                send.setClipData(ClipData.newRawUri("", uri));
                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            }
            send.setSelector(mail);
            Intent chooser = Intent.createChooser(send, "E-posta uygulamanı seç");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }
}
