package service;

/**
 * Created by Mouze on 2016/7/6.
 */
public interface LoginService {
    public boolean LoginAsAdmin(String id, String password);
    public boolean LoginAsStudent(String id, String password);
    public boolean LoginAsTeacher(String id, String password);
}
