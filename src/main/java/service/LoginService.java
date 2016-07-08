package service;

import model.Admin;
import model.Student;
import model.Teacher;

/**
 * Created by Mouze on 2016/7/6.
 */
public interface LoginService {
    public Admin LoginAsAdmin(String id, String password);
    public Student LoginAsStudent(String id, String password);
    public Teacher LoginAsTeacher(String id, String password);
}
