# Capacitor
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }

# WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep source file names for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
