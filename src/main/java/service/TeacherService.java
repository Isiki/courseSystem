package service;

import model.Course;
import model.Teacher;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/4.
 */
public interface TeacherService {
    boolean teacherLogin(String id);
    Teacher getTeacherById(String id);
    List<Teacher> getAllTeachers();
    List<Course> getCourses(String teacher_id);

}
