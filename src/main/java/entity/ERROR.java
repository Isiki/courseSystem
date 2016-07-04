package entity;

import java.util.HashMap;

/**
 * Created by isiki on 2016/7/04.
 */
public class ERROR {
    public static int USER_NOT_EXIST=1;
    public static int PASSWORD_ERROR=2;
    public static int TASK_NUMBER_EXIST=3;
    public static int WORK_HOUR_EXIST=4;
    public static int DATE_ILLEGAL=5;
    public static int FILL_CURRENT_MONTH_WORKHOUR=6;
    public static int UNEDIT_TASKMONTH_ERROR=7;
    public static int SEND_EMAIL_FAIL=8;
    public static int OBJECT_VALID_FAIL=9;
    public static int USER_IS_EXIST=10;
    public static int UNKNOWN_ERROR=1000;

    public static HashMap<Integer,String> hashMap=new HashMap<Integer, String>();
    static {
        hashMap.put(USER_NOT_EXIST,"用户名不存在");
        hashMap.put(PASSWORD_ERROR,"密码错误");
        hashMap.put(TASK_NUMBER_EXIST,"任务已经存在");
        hashMap.put(WORK_HOUR_EXIST,"您已填写过该工时，如果需要修改，请联系管理员");
        hashMap.put(DATE_ILLEGAL,"日期不合法");
        hashMap.put(UNKNOWN_ERROR,"未知错误");
        hashMap.put(FILL_CURRENT_MONTH_WORKHOUR,"任务月份和工时月份不一致");
        hashMap.put(UNEDIT_TASKMONTH_ERROR,"请先填写当月的工时完成情况");
        hashMap.put(SEND_EMAIL_FAIL,"发送邮件失败,请检查邮箱是否正确");
        hashMap.put(OBJECT_VALID_FAIL,"验证失败");
        hashMap.put(USER_IS_EXIST,"用户名已存在");
    }
}
