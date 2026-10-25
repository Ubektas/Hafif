package com.ugurbektas.hafif;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.ugurbektas.hafif.widget.WidgetPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetPlugin.class);
        super.onCreate(savedInstanceState);
        // Telefonun büyük yazı ayarı WebView'da tasarımı bozuyor (başlık taşar, gün adları üst üste biner).
        // Uygulama kendi yazı boyutlarını kullanır; erişilebilirlik için koyu tema ve kalın rakamlar var.
        if (getBridge() != null) getBridge().getWebView().getSettings().setTextZoom(100);
    }
}
