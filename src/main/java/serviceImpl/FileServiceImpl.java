package serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import service.FileService;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
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
}
