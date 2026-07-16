package com.tictactoe.tiktoker;

import android.app.DownloadManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;

public class MainActivity extends BridgeActivity {

    @Override
    public void onResume() {
        super.onResume();
        WebView webView = getBridge().getWebView();
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                try {
                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                    String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                    request.setTitle(fileName);
                    request.setDescription("Загрузка обновления...");
                    request.setAllowedOverMetered(true);
                    request.setAllowedOverRoaming(true);

                    DownloadManager downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                    long downloadId = downloadManager.enqueue(request);

                    Toast.makeText(MainActivity.this, "Загрузка начала...", Toast.LENGTH_SHORT).show();

                    new Thread(() -> {
                        boolean downloading = true;
                        while (downloading) {
                            DownloadManager.Query query = new DownloadManager.Query();
                            query.setFilterById(downloadId);
                            android.database.Cursor cursor = downloadManager.query(query);
                            if (cursor != null && cursor.moveToFirst()) {
                                int status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                                if (status == DownloadManager.STATUS_SUCCESSFUL) {
                                    downloading = false;
                                    String filePath = cursor.getString(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_LOCAL_URI));
                                    installApk(filePath);
                                } else if (status == DownloadManager.STATUS_FAILED) {
                                    downloading = false;
                                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "Ошибка загрузки", Toast.LENGTH_SHORT).show());
                                }
                            }
                            if (cursor != null) cursor.close();
                            if (downloading) {
                                try { Thread.sleep(1000); } catch (InterruptedException ignored) {}
                            }
                        }
                    }).start();

                } catch (Exception e) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                }
            }
        });
    }

    private void installApk(String fileUri) {
        runOnUiThread(() -> {
            try {
                Uri uri;
                if (fileUri.startsWith("content://")) {
                    uri = Uri.parse(fileUri);
                } else {
                    File file = new File(Uri.parse(fileUri).getPath());
                    uri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", file);
                }
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setDataAndType(uri, "application/vnd.android.package-archive");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (Exception e) {
                Toast.makeText(this, "Не удалось открыть APK. Проверьте настройки установки из неизвестных источников.", Toast.LENGTH_LONG).show();
            }
        });
    }
}
