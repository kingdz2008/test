import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;

public class DownTingWa {

    public static void main(String[] args) {
        int start = 20185;
        int mark = 0;
        String baseUrl = "http://www.itingwa.com/listen/";

        while (true) {
            {
                {
                    System.setProperty("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.SimpleLog");
                    System.setProperty("org.apache.commons.logging.simplelog.showdatetime", "true");
                    System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.commons.httpclient",
                            "error");
                }

                String songUrl = baseUrl + start;

                String htmlSource = null;
                try {
                    htmlSource = get(songUrl);
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
                if (htmlSource == null) {
                    continue;
                }
                // System.out.println(htmlSource);
                if (htmlSource.indexOf("页面未找到") != -1) {
                    System.out.println(start + "\t404");
                    start++;
                    continue;
                }
                int a = htmlSource.indexOf("frame1");
                a = htmlSource.indexOf("<h1>", a) + 4;
                int b = htmlSource.indexOf("<a href", a);
                b = htmlSource.indexOf("<a href", a);
                String fileName = null;
                try {
                    fileName = "" + start + " - " + htmlSource.substring(a, b).trim();
                } catch (Exception e1) {
                    try {
                        TimeUnit.SECONDS.sleep(5);
                    } catch (InterruptedException e) {

                    }
                    continue;
                }
                fileName = HomeUtils.processName(fileName);
                System.out.println(fileName);

                a = htmlSource.indexOf("<div id=\"tw_player\"", b);
                a = htmlSource.indexOf("http", a);
                b = htmlSource.indexOf("</div>", a) - 2;
                String downloadUrl = htmlSource.substring(a, b);
                System.out.println(downloadUrl);

                File baseFilePath = new File("E:\\itingwa\\");
                if (!baseFilePath.exists()) {
                    baseFilePath = new File("D:\\gittest\\music\\");
                }
                Html html = new Html();
                String result = html.downloadMusicAtHome(downloadUrl, fileName, start, baseFilePath, null);
                System.out.println(result);
                if (result.contains("success")) {
                    mark = 0;
                    start++;
                } else if (result.contains("already exists")) {
                    start++;
                } else if (result.contains("file length error") || result.contains("file length small")) {
                    mark++;
                    try {
                        TimeUnit.SECONDS.sleep(10);
                    } catch (InterruptedException e) {

                    }
                    if (mark == 5) {
                        start++;
                        mark = 0;
                    }
                }
            }
        }
    }

    public static String get(String url) throws Exception {
        HttpClient httpClient = new HttpClient();
        // 创建GET方法的实例
        GetMethod getMethod;
        try {
            getMethod = new GetMethod(url);
        } catch (Exception e1) {
            throw e1;
        }
        // 使用系统提供的默认的恢复策略
        getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler());
        try {
            // 执行getMethod
            int statusCode = httpClient.executeMethod(getMethod);
            if (statusCode != HttpStatus.SC_OK) {
                System.err.println("Method failed: " + getMethod.getStatusLine());
            }
            // 读取内容
            byte[] responseBody = getMethod.getResponseBody();
            // 处理内容
            // System.out.println(new String(responseBody));
            return new String(responseBody, "utf-8");
        } catch (HttpException e) {
            // 发生致命的异常，可能是协议不对或者返回的内容有问题
            System.out.println("Please check your provided http address!");
            // e.printStackTrace();
            throw e;
        } catch (IOException e) {
            // 发生网络异常
            // e.printStackTrace();
            throw e;
        } finally {
            // 释放连接
            getMethod.releaseConnection();
        }
    }
}
