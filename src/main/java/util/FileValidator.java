package util;

import entity.FileBucket;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 * Created by isiki on 2016/7/5.
 */
public class FileValidator implements Validator {

    public boolean supports(Class<?> clazz) {
        return FileBucket.class.isAssignableFrom(clazz);
    }

    public void validate(Object obj, Errors errors) {
        FileBucket file = (FileBucket) obj;

        if(file.getFile()!=null){
            if (file.getFile().getSize() == 0) {
                errors.rejectValue("file", "missing.file");
            }
        }
    }
}