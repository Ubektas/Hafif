package com.ugurbektas.hafif;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.ugurbektas.hafif.widget.WidgetPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
