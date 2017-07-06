import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit;

public class DownloadAckunMusic {

    public static void main(String[] args) {
        File file = new File("D:/gittest/test/test/downurl.txt");
        if (!file.exists()) {

        }
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "GBK"));
            String str = br.readLine();
            while (str != null) {
                String[] array = str.split("\\|");
                if (array.length == 4) {
                    process(array);
                } else {
                    System.out.println("ERROR");
                    System.out.println(str);
                    break;
                }
                str = br.readLine();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {

                }
            }
        }

    }

    private static void process(String[] array) {
        String number = HomeUtils.getNotNullStr(array[0]);
        String name = HomeUtils.getNotNullStr(array[1]);
        name = HomeUtils.processName(name);
        String post = HomeUtils.getNotNullStr(array[2]);
        String url = HomeUtils.getNotNullStr(array[3]);
        String filename = number + " ----- " + name + "." + post;
        String result = "";
        int time = 0;
        while (!result.contains("success")) {
            System.out.println(filename);
            result = new Html().downloadMusicAtJar(url, filename, Integer.parseInt(number), new File("E:/ackun/"));
            System.out.println(result);
            if (result.contains("already exists")) {
                break;
            }
            if (result.contains("file length error") || result.contains("file length small")) {
                time++;
                if (time > 5) {
                    break;
                }
            }
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (InterruptedException e) {

            }
        }
    }

}
