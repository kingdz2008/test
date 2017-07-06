import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import assist.ContextNode;
import au.id.jericho.lib.html.Source;

public class Html {

    public String downloadMusicAtJar(String downUrl, String fileName, int start, File baseFilePath) {
        return downloadMusicAtHome(downUrl, fileName, start, baseFilePath, null);
    }

    public String downloadMusicAtHome(String downUrl, String fileName, int start, File baseFilePath,
            Map<String, Integer> okMap) {
        long begin = System.currentTimeMillis();
        URL url = null;
        try {
            url = new URL(downUrl);
        } catch (MalformedURLException e) {
            return "exception " + e.getClass() + " || " + e.getMessage();
        }

        String postFix = getUrlPostFix(url);
        if (postFix.contains("error")) {
            System.out.println(postFix);
            return postFix;
        }

        String rootPath = baseFilePath.getAbsolutePath() + File.separator;
        File file = new File(rootPath + fileName + "." + postFix);
        int fileLength;
        InputStream in = null;
        try {
            HttpURLConnection urlcon = (HttpURLConnection) url.openConnection();

            {
                System.out.println("connection is open at " + new SimpleDateFormat("HH:mm:ss").format(new Date()));
                urlcon.setConnectTimeout(20 * 1000);
                urlcon.setReadTimeout(20 * 1000);
                fileLength = urlcon.getContentLength();
                System.out.println("fileLength is " + fileLength + "\t\t" + fileLength / 1024 + "K " + "\t\t"
                        + fileLength / 1024 / 1024 + "M");
                if (fileLength < 0) {
                    return "file length error [" + fileLength + "]";
                } else if (fileLength / 1024 < 10) {
                    return "file length small [" + fileLength + "]";
                }

                if (okMap != null) {
                    if (checkMap(okMap, start, fileLength)) {
                        return "already download";
                    }
                }

                if (DownloadMusic.WHO.equals(ContextNode.ME)) {
                    File oldFile = new File(Process.PATH + File.separator + (Process.number - 1) + File.separator
                            + fileName + "." + postFix);
                    if (oldFile.exists()) {
                        if (oldFile.length() != fileLength) {
                            oldFile.delete();
                            System.out.println("old file download percent error");
                            return "file download percent error";
                        } else {
                            System.out.println("old file is already exists");
                            return "file is already exists";
                        }
                    }
                }

                if (file.exists()) {
                    if (file.length() != fileLength) {
                        file.delete();
                        System.out.println("file download percent error");
                    } else {
                        System.out.println("file is already exists");
                        return "file is already exists";
                    }
                }
                int limit = 300;
                if (fileLength / 1024 / 1024 >= limit) {
                    return "file length[" + fileLength / 1024 / 1024 + "]M is too big,more than[" + limit + "]M";
                }
            }

            in = urlcon.getInputStream();
        } catch (ConnectException e) {
            return "connect time out";
        } catch (FileNotFoundException e) {
            return "file is not exists";
        } catch (IOException e) {
            if (e.getLocalizedMessage().toLowerCase().contains("time out")) {
                return "connect time out";
            }
            return e.getClass() + "||" + e.getMessage();
        } catch (IllegalArgumentException e) {
            return e.getClass() + "||" + e.getMessage();
        }

        System.out.println("download start");
        long end = System.currentTimeMillis();
        if ((end - begin) / 1000 > 10) {
            return "search time out[" + (end - begin) + "]";
        }

        FileOutputStream out = null;
        try {
            return downNotUseByOutside(out, in, rootPath, fileName, postFix, file, fileLength);
        } catch (FileNotFoundException e) {
            // return "FileNotFoundException " + e.getMessage();
            try {
                fileName = "KING_SYSTEM_ERROR--" + start;
                file = new File(rootPath + fileName + "." + postFix);
                return downNotUseByOutside(out, in, rootPath, fileName, postFix, file, fileLength);
            } catch (IOException e1) {
                return "IOException " + e1.getMessage();
            }
        } catch (IOException e) {
            return e.getClass() + "||" + e.getMessage();
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {

                }
            }

            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {

                }
            }
        }
    }

    /**
     * 检查是否已经下载过
     */
    private boolean checkMap(Map<String, Integer> okMap, int start, int fileLength) {
        if (okMap.keySet().contains("" + start)) {
            int length = okMap.get("" + start);
            if (fileLength == length) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) throws Exception {
        URL url = new URL("http://srh.bankofchina.com/search/finprod/getProdPage.jsp?keyword=AMRJYL01");
        HttpURLConnection urlcon = (HttpURLConnection) url.openConnection();
        urlcon.setConnectTimeout(20 * 1000);
        urlcon.setReadTimeout(20 * 1000);
        InputStream in = urlcon.getInputStream();
        int fileLength = urlcon.getContentLength();
        String rootPath = "c://";
        String fileName = "haha";
        String postFix = "pdf";
        File file = new File(rootPath + fileName + "." + postFix);
        FileOutputStream out = null;
        new Html().downNotUseByOutside(out, in, rootPath, fileName, postFix, file, fileLength);
    }

    /**
     * 下载歌曲
     */
    private String downNotUseByOutside(FileOutputStream out, InputStream in, String rootPath, String fileName,
            String postFix, File file, int fileLength) throws IOException {
        out = new FileOutputStream(rootPath + fileName + "." + postFix);
        byte[] b = new byte[1024 * 5];
        int length = 0;
        double percent = 0;
        long begin = System.currentTimeMillis();
        long end;
        int needDelete = 0;
        while ((length = in.read(b)) != -1) {
            out.write(b, 0, length);
            end = System.currentTimeMillis();
            if ((end - begin) / 1000 > 5000) {
                System.out.println("download time out");
                needDelete = 1;
                break;
            }
            long fileDX = file.length();
            java.text.DecimalFormat myformat = new java.text.DecimalFormat("#0.00");
            percent = (double) fileDX / (double) fileLength * 100;
            if (percent < 0) {
                break;
            } else if (percent > 100) {
                break;
            }
            System.out.println(" OK%=" + myformat.format(percent) + "%" + "\t"
                    + fileName.substring(Math.max(0, fileName.indexOf("--"))) + "\t"/*
                                                                                     * +houZhui + "\t\t"
                                                                                     */
                    + fileLength / 1024 + "K" + "\t" + fileLength / 1024 / 1024 + "M" + "\t" + (end - begin) / 1000.0
                    + "s");

            int timeLimit = 60;
            int per = 20;
            if ((end - begin) / 1000 > timeLimit) {
                long cost = end - begin;
                cost = cost / 1000;
                int len = fileLength / 1024 / 1024;
                if (len == 0) {
                    percent = 0;
                    break;
                }
                long speed = cost / len;
                System.out.println("into speed check\t\t\t" + speed);
                if (cost / len > per) {
                    percent = 0;
                    break;
                }
            }
        }
        out.flush();

        try {
            if (out != null) {
                out.close();
            }
        } catch (Exception e) {

        }

        if (needDelete == 1) {
            file.delete();
            return "file download error";
        }

        if (percent < 100) {
            file.delete();
            System.out.println("file downlaod error");
            return "file download percent error";
        } else {
            System.out.println("file download success");
            return "file download success";
        }
    }

    /**
     * 检查并获得文件扩展名
     */
    private String getUrlPostFix(URL url) {
        String postFix = "" + url;
        if (postFix.endsWith("=")) {
            return "";
        }
        postFix = postFix.substring(postFix.length() - 3, postFix.length());
        String postFixBak = postFix.toLowerCase();
        if (postFixBak.contains("mp3") || postFixBak.contains("wma") || postFixBak.contains("wav")
                || postFixBak.contains("m4a")) {
            return postFix;
        } else {
            return "the extends of the file is error[" + postFixBak + "]";
        }
    }

    public String getStringByReg(String source, String reg) {
        // String reg = "<song_name>.*</song_name>";
        Pattern pattern = Pattern.compile(reg);
        Matcher matcher = pattern.matcher(source);

        StringBuilder strb = new StringBuilder();
        while (true) {
            if (matcher.find()) {
                strb.append(matcher.group());
            }
            break;
        }
        String name = strb.toString();
        // name = name.replace("<song_name>", "").replace("</song_name>", "");
        return name;
    }

    public String getDownloadUrlEndByMp3(String url, String number) throws Exception {
        return getDownloadMusicUrl(url, number, "mp3");
    }

    public String getDownloadUrlEndByAndroid(String url, String number) throws Exception {
        url = "http://www.songtaste.com/api/android/songurl.php?songid=" + number;
        ClientUtil client = new ClientUtil();
        String nr;
        try {
            nr = client.get(url);
        } catch (Exception e) {
            throw e;
        }
        nr = client.getSource(url);
        Source s = new Source(nr);
        String str = s.toString();
        // System.out.println(str);

        {
            String name = getStringByReg(str, "<song_name>.*</song_name>");
            name = name.replace("<song_name>", "").replace("</song_name>", "");
            String singerName = getStringByReg(str, "<singer_name>.*</singer_name>");
            singerName = singerName.replace("<singer_name>", "").replace("</singer_name>", "");
            name = name + " - " + singerName;
            System.out.println("name=[" + name + "]");
            if (name.trim().length() == 0) {
                System.out.println("filename is empty");
                return ContextNode.NAME_URL_SPLIT + " ";
            }
            String url1 = getStringByReg(str, "<url>.*</url>");
            url1 = url1.replace("<url>", "").replace("</url>", "");
            return name + ContextNode.NAME_URL_SPLIT + url1;
            // ret = name + ContextNode.NAME_URL_SPLIT;
        }
    }

    public String getDownloadMusicUrl(String url, String number, String method) throws Exception {
        String ret = "";
        StringBuilder strb = new StringBuilder();

        ClientUtil client = new ClientUtil();
        String nr;
        try {
            nr = client.get(url);
        } catch (Exception e1) {
            throw e1;
        }
        nr = client.getSource(url);
        Source s = new Source(nr);
        String str = s.toString();
        {
            String reg = "<title>.*</title>";
            Pattern pattern = Pattern.compile(reg);
            Matcher matcher = pattern.matcher(str);

            strb = new StringBuilder();
            while (true) {
                if (matcher.find()) {
                    strb.append(matcher.group());
                }
                break;
            }
            String name = strb.toString();
            name = name.replace("<title>", "").replace("</title>", "");
            // System.out.println("name=[" + name + "]");
            if (name.trim().length() == 0) {
                System.out.println("filename is empty");
                return ContextNode.NAME_URL_SPLIT + " ";
            }
            ret = name + ContextNode.NAME_URL_SPLIT;
        }
        if (method.equals("mp3")) {
            url = "http://www.songtaste.com/api/android/songurl.php?songid=" + number;
            try {
                nr = client.get(url);
            } catch (Exception e) {
                throw e;
            }
            nr = client.getSource(url);
            s = new Source(nr);
            str = s.toString();
            // System.out.println(str);

            String reg = "<url>.*</url>";
            Pattern pattern = Pattern.compile(reg);
            Matcher matcher = pattern.matcher(str);
            strb = new StringBuilder();
            while (true) {
                if (matcher.find()) {
                    strb.append(matcher.group());
                }
                break;
            }
            // System.out.println(strb.toString());
            str = strb.toString();
            str = str.replace("<url>", "");
            str = str.replace("</url>", "");
            // System.out.println(str);
            ret = ret + str;
        } else {
            String reg = "javascript:playmedia1(.*?);";

            Pattern pattern = Pattern.compile(reg);
            Matcher matcher = pattern.matcher(str);

            strb = new StringBuilder();
            while (true) {
                if (matcher.find()) {
                    strb.append(matcher.group());
                }
                break;
            }
            // System.out.println(str);
            // System.out.println(strb.toString());

            str = strb.toString();
            str = str.replace("javascript:playmedia1(", "").replace(");", "").replaceAll("'", "").replaceAll(" ", "");
            // System.out.println(str);
            if (str.split(",").length < 2) {
                System.out.println("the download url is empty");
                return ContextNode.NAME_URL_SPLIT + " ";
            }
            str = str.split(",")[2];
            // System.out.println(str);

            // data:{str:str,sid:id,t:0},
            url = "http://www.songtaste.com/time.php?str=" + str + "&sid=" + number + "&t=0";
            try {
                nr = client.get(url);
            } catch (Exception e) {
                throw e;
            }
            nr = client.getSource(url);
            s = new Source(nr);
            str = s.toString();
            str = str.replace("\\n", "").replace("\\t", "").replace("" + (char) 10, "");
            // System.out.println("url=[" + str + "]");
            ret = ret + str;
        }
        return ret;
    }

}
