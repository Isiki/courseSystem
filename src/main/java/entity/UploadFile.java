package entity;
import java.io.File;

/**
 * Created by isiki on 2016/7/5.
 */
public class UploadFile {
    private String saveDirectory;
    private String fileName;
    private String contentType;

    public UploadFile(String saveDirectory, String filesystemName) {
        this.saveDirectory = saveDirectory;
        this.fileName = filesystemName;
    }

    public String getFileName() {
        return fileName;
    }

    public String getSaveDirectory() {
        return saveDirectory;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setSaveDirectory(String saveDirectory) {
        this.saveDirectory = saveDirectory;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public File getFile() {
        if (getSaveDirectory() == null || getFileName() == null) {
            return null;
        } else {
            return new File(getSaveDirectory() + "/" + getFileName());
        }
    }
}