package service;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

/**
 * Created by isiki on 2016/7/5.
 */
public interface FileService {
    File saveFile(HttpServletRequest request, String filepath) throws IOException;
}
