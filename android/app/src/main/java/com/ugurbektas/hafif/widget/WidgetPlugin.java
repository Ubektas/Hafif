package com.ugurbektas.hafif.widget;

import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import androidx.core.content.FileProvider;
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
