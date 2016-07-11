package serviceImpl;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import service.FileService;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by isiki on 2016/7/5.
 */
@Service
public class FileServiceImpl implements FileService {
    public String saveFile(HttpServletRequest request, String filepath) throws IOException {

        // 转换为文件类型的request
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        // 获取对应file对象
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        Iterator<String> fileIterator = multipartRequest.getFileNames();


        List<File> uploadFiles = new ArrayList<>();

        while (fileIterator.hasNext()) {
            String fileKey = fileIterator.next();

            // 获取对应文件
            MultipartFile theFile = fileMap.get(fileKey);
            System.out.println(theFile.getBytes());

            if (theFile.getSize() != 0L) {
                //to-do: validate file

                // 调用saveFile方法保存
                uploadFiles.add(saveEveryFile(theFile, filepath));
            }
        }


        return filesToJson(uploadFiles, "add");
    }

    private File saveEveryFile(MultipartFile file, String filepath) throws IOException {
        String fileName = file.getOriginalFilename();

        File targetFile = new File(filepath, fileName);
        file.transferTo(targetFile);

        return targetFile;
    }

    public List<File> getAllFiles(String dir)
    {
        File dirFile = new File(dir);
        File[] files = dirFile.listFiles();
        return Arrays.asList(files);
    }

    private static final DateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

    public String filesToJson(List<File> files, String action)
    {
        if (files == null)
            return "";
        JSONArray arr = new JSONArray();
        for(File file : files)
        {
            Map<String,String> list = new HashMap<>();

            list.put("fileName",file.getName());
            list.put("fileType", file.isDirectory()?"folder":"file");
            list.put("fileCTime",format.format(new Date(file.lastModified())));
            list.put("fileSize",getFormatSize(file.length()));
            arr.add(list);
        }
        JSONObject obj = new JSONObject();
        obj.put("action", action);
        obj.put("data",arr);
        return obj.toString();
    }

    public String filesToJson(List<File> files)
    {
        return filesToJson(files,"show");
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

    public String getDirStructionJson(String filepath)
    {
        File rootPath = new File(filepath);
        if(!rootPath.isDirectory())
        {
            return "";
        }
        JSONObject rootObj = new JSONObject();
        rootObj.put("text", "资源");
        rootObj.put("type", "folder");
        rootObj.put("children", getDirJsonArray(rootPath));
        return rootObj.toString();
    }

    private JSONArray getDirJsonArray(File filepath)
    {
        JSONArray arr = new JSONArray();
        try {
            File[] files = filepath.listFiles();

            for(File file : files)
            {
                JSONObject obj = new JSONObject();
                obj.put("text", file.getName());
                if (file.isDirectory()) {
                    //目录
                    obj.put("type", "folder");
                    obj.put("children", getDirJsonArray(file));
                    arr.add(obj);
                }
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        return arr;
    }

}
