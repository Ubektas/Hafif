package com.ugurbektas.hafif.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;

import com.ugurbektas.hafif.MainActivity;
import com.ugurbektas.hafif.R;

import java.io.File;
import java.io.FileOutputStream;

/** Hafif'in 10 ana ekran widget'ı. Her tür ayrı bir sağlayıcıdır (widget listesinde ayrı görünür). */
public final class HafifWidgets {
    private HafifWidgets() {}

    /** Tür numarası ve varsayılan boyutu (dp). */
    static final int[][] DEF = {{0, 0}, {170, 170}, {170, 80}, {170, 170}, {170, 80}, {170, 170}, {170, 170}, {170, 170}, {170, 170}, {170, 170}, {170, 170}};
    static final Class<?>[] KINDS = {null, Dongu.class, Siradaki.class, Bugun.class, Kilo.class, Grafik.class, Hedef.class, Su.class, Protein.class, Adim.class, Takviye.class};

    public static void updateAll(Context ctx) {
        AppWidgetManager m = AppWidgetManager.getInstance(ctx);
        for (int k = 1; k < KINDS.length; k++) {
            int[] ids = m.getAppWidgetIds(new ComponentName(ctx, KINDS[k]));
            if (ids == null || ids.length == 0) continue;
            WidgetData d = WidgetData.load(ctx);
            for (int id : ids) update(ctx, m, id, k, d);
        }
    }

    static void update(Context ctx, AppWidgetManager m, int id, int kind, WidgetData d) {
        try {
            Bundle o = m.getAppWidgetOptions(id);
            int w = o == null ? 0 : o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH);
            int h = o == null ? 0 : o.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT);
            if (w <= 0) w = DEF[kind][0];
            if (h <= 0) h = DEF[kind][1];
            float density = ctx.getResources().getDisplayMetrics().density;
            WidgetRenderer.Result r = new WidgetRenderer(ctx).render(kind, d, w, h, density);
            RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.hafif_widget);
            v.setImageViewBitmap(R.id.w_img, r.bmp);
            v.setOnClickPendingIntent(R.id.w_img, intent(ctx, id * 10, r.main));
            if (r.buttons.isEmpty()) v.setViewVisibility(R.id.w_btns, View.GONE);
            else {
                v.setViewVisibility(R.id.w_btns, View.VISIBLE);
                int pad = Math.round(14 * density), left = Math.round(r.buttonsLeft * density);
                v.setViewPadding(R.id.w_btns, left, 0, pad, 0);
                v.setOnClickPendingIntent(R.id.w_b1, intent(ctx, id * 10 + 1, r.buttons.get(0)[1]));
                v.setContentDescription(R.id.w_b1, r.buttons.get(0)[0]);
                if (r.buttons.size() > 1) {
                    v.setViewVisibility(R.id.w_gap, View.VISIBLE);
                    v.setViewVisibility(R.id.w_b2, View.VISIBLE);
                    v.setOnClickPendingIntent(R.id.w_b2, intent(ctx, id * 10 + 2, r.buttons.get(1)[1]));
                    v.setContentDescription(R.id.w_b2, r.buttons.get(1)[0]);
                } else {
                    v.setViewVisibility(R.id.w_gap, View.GONE);
                    v.setViewVisibility(R.id.w_b2, View.GONE);
                }
            }
            m.updateAppWidget(id, v);
        } catch (Exception ignored) {
        }
    }

    /** Dokununca uygulama hafif://w/<eylem> bağlantısıyla açılır; eylemi uygulama yapar. */
    static PendingIntent intent(Context ctx, int code, String action) {
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("hafif://w/" + action), ctx, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(ctx, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Test ve görsel kontrol için: her türü küçük ve büyük boyutta files/wprev/ altına PNG olarak çizer. */
    static String preview(Context ctx) throws Exception {
        File dir = new File(ctx.getFilesDir(), "wprev");
        if (!dir.exists() && !dir.mkdirs()) throw new Exception("klasör açılamadı");
        WidgetData d = WidgetData.load(ctx);
        d.forcePlus = true;
        WidgetRenderer rd = new WidgetRenderer(ctx);
        StringBuilder out = new StringBuilder();
        for (int k = 1; k < KINDS.length; k++) {
            int[][] sizes = (k == 2 || k == 4) ? new int[][]{{170, 80}, {360, 80}, {360, 170}} : new int[][]{{170, 170}, {360, 170}};
            for (int[] sz : sizes) {
                String name = k + "-" + sz[0] + "x" + sz[1] + ".png";
                save(rd.render(k, d, sz[0], sz[1], 2f).bmp, new File(dir, name));
                out.append(name).append(',');
            }
        }
        d.forcePlus = false;
        save(rd.render(1, d, 170, 170, 2f).bmp, new File(dir, "kilitli.png"));
        out.append("kilitli.png");
        return out.toString();
    }

    private static void save(Bitmap b, File f) throws Exception {
        try (FileOutputStream o = new FileOutputStream(f)) { b.compress(Bitmap.CompressFormat.PNG, 100, o); }
    }

    // ---------- sağlayıcılar ----------
    public abstract static class Base extends AppWidgetProvider {
        abstract int kind();

        @Override
        public void onUpdate(Context ctx, AppWidgetManager m, int[] ids) {
            WidgetData d = WidgetData.load(ctx);
            for (int id : ids) update(ctx, m, id, kind(), d);
        }

        @Override
        public void onAppWidgetOptionsChanged(Context ctx, AppWidgetManager m, int id, Bundle opts) {
            update(ctx, m, id, kind(), WidgetData.load(ctx));
        }
    }

    public static class Dongu extends Base { int kind() { return 1; } }
    public static class Siradaki extends Base { int kind() { return 2; } }
    public static class Bugun extends Base { int kind() { return 3; } }
    public static class Kilo extends Base { int kind() { return 4; } }
    public static class Grafik extends Base { int kind() { return 5; } }
    public static class Hedef extends Base { int kind() { return 6; } }
    public static class Su extends Base { int kind() { return 7; } }
    public static class Protein extends Base { int kind() { return 8; } }
    public static class Adim extends Base { int kind() { return 9; } }
    public static class Takviye extends Base { int kind() { return 10; } }
}
