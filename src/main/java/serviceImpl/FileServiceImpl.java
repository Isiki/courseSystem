package serviceImpl;


import com.google.gson.JsonArray;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import service.FileService;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

/**
 * Created by isiki on 2016/7/5.
 */
@Service
public class FileServiceImpl implements FileService {
    public File saveFile(HttpServletRequest request, String filepath) throws IOException {

        // 转换为文件类型的request
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        // 获取对应file对象
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        Iterator<String> fileIterator = multipartRequest.getFileNames();

        while (fileIterator.hasNext()) {
            String fileKey = fileIterator.next();

            // 获取对应文件
            MultipartFile theFile = fileMap.get(fileKey);
            System.out.println(theFile.getBytes());

            if (theFile.getSize() != 0L) {
                //to-do: validate file

                // 调用saveFile方法保存
                File finalFile = saveEveryFile(theFile, filepath);

                return finalFile;
            }
        }

        return null;
    }

    private File saveEveryFile(MultipartFile file, String filepath) throws IOException {
        String fileName = file.getOriginalFilename();

        // 封装了一个简单的file对象，增加了几个属性
        //UploadFile upfile = new UploadFile(filepath, fileName);
        //upfile.setContentType(file.getContentType());

        // 通过org.apache.commons.io.FileUtils的writeByteArrayToFile进行保存
        //FileUtils.writeByteArrayToFile(upfile.getFile(), file.getBytes());

        File targetFile = new File(filepath, fileName);
        file.transferTo(targetFile);

        return targetFile;
    }

    public File[] getAllFiles(String dir)
    {
        File dirFile = new File(dir);
        File[] files = dirFile.listFiles();
        return files;
    }

    public String filesToJson(File[] files)
    {
        if (files == null)
            return "";
        JSONArray arr = new JSONArray();
        for(File file : files)
        {
            List<String> list = new ArrayList<String>();
            list.add(file.getName());
            list.add(file.isDirectory()?"folder":"file");
            list.add(getFormatSize(file.length()));
            arr.add(list);
        }
        return arr.toString();
    }

    private String getFormatSize(long size) {
        double kiloByte = (double)size/1024;
        if(kiloByte < 1) {
            return size + "B";
        }

        double megaByte = kiloByte/1024;
        if(megaByte < 1) {
            BigDecimal result1 = new BigDecimal(Double.toString(kiloByte));
            return result1.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "KB";
        }

        double gigaByte = megaByte/1024;
        if(gigaByte < 1) {
            BigDecimal result2  = new BigDecimal(Double.toString(megaByte));
            return result2.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "MB";
        }

        double teraBytes = gigaByte/1024;
        if(teraBytes < 1) {
            BigDecimal result3 = new BigDecimal(Double.toString(gigaByte));
            return result3.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "GB";
        }
        BigDecimal result4 = new BigDecimal(teraBytes);
        return result4.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "TB";
    }
}
