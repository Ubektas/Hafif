package com.ugurbektas.hafif.widget;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

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
}
