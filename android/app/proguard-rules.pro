# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Hafif: kendi eklentimiz ve widget sınıfları (manifest ve köprü yansımayla çağırır)
-keep class com.ugurbektas.hafif.** { *; }
# WebView ve JavaScript köprüsü
-keepattributes JavascriptInterface,*Annotation*
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }

# Capacitor 8.5.3'ün kendi kurallarında olmayan, sonraki Capacitor sürümlerinde eklenen satırlar:
# R8 tam modu (AGP 8+) eklenti açıklamalarını (annotation) çalışma anında okunamaz hâle getirebiliyor;
# bu durumda izin isteme (requestPermissions → @PermissionCallback) gibi yansımayla bulunan yollar bozuluyor
# (Play'deki 2.0.0'da "Bildirim izni alınamadı").
-keep @interface com.getcapacitor.annotation.** { *; }
-keep @interface com.getcapacitor.PluginMethod { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.PermissionCallback <methods>;
}
