package entity;
import org.apache.log4j.Logger;


/**
 * Created by isiki on 2016/7/4.
 */
public class BaseException extends Exception{
    private int errorCode;
    private String msg;

    public String getMsg() {
        return msg;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public BaseException(int errorCode, String msg) {
        super(msg);
        this.errorCode = errorCode;
        this.msg = msg;
    }
    public BaseException(int errorCode) {
        String msg=ERROR.hashMap.get(errorCode);
        if(msg==null){
            msg="";
        }
        this.errorCode = errorCode;
        this.msg = msg;
    }

    public static void logStackTrace(Logger logger,Exception e){
        StackTraceElement[] error = e.getStackTrace();
        StringBuilder stacktrace=new StringBuilder();
        for (StackTraceElement stackTraceElement : error) {
            stacktrace.append(stackTraceElement.toString()+"\n");
        }
        logger.error(stacktrace);
        logger.error(e.getMessage());
    }
}
