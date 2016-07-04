package entity;

/**
 * Created by isiki on 2016/7/4.
 */

public class AjaxResponse {
    private int code;
    private String msg;
    private Object data;

    public  AjaxResponse(){
        code=0;
        msg="";
        data="";
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
