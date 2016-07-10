package dao;

/**
 * Created by andyz_000 on 2016/7/4.
 */

import model.Course;
import model.Teacher;

import java.util.List;

public interface TeacherDao extends Dao<Teacher,String> {
    List<Teacher> getAllTeachers();
    List<Course> getCourses(String teacher_id);

}
