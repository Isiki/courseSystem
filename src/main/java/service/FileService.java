package service;



import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.List;


/**
 * Created by isiki on 2016/7/5.
 */
public interface FileService {
    String saveFile(HttpServletRequest request, String filepath) throws IOException;
    List<File> getAllFiles(String dir);
    String filesToJson(List<File> files);
    String filesToJson(List<File> files,  String action);
    String getDirStructionJson(String filepath);
}
