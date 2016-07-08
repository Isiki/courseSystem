package dao;

import model.Course;
import model.Student;
import model.Teacher;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/4.
 */
public interface CourseDao {

    void updateCourse(Course course);
    Course getCourseById(String id);
    Course getCourseByName(String name);
    Course getCourseByTeacherId(int id);

    List<Course> getCoursesByName(String name);
    List<Course> getCoursesByTeacherId(int id);
    List<Course> getCoursesByTeacherNameBad(String tname);
    List<Course> getAll();

    List<Teacher> getTeachersByCourseId(String id);
    List<Student> getStudentsByCourseId(String id);

}
