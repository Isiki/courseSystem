package service;

import model.Teacher;

/**
 * Created by andyz_000 on 2016/7/4.
 */
public interface TeacherService {
    boolean teacherLogin(String id);
    Teacher getTeacherById(String id);

}
