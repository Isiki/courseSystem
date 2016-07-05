package dao;

import model.Course;
import model.Student;
import model.Teacher;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/4.
 */
public interface CourseDao {

    public void updateCourse(Course course);
    public Course getCourseById(String id);
    public Course getCourseByName(String name);
    public Course getCourseByTeacherId(int id);

    public List<Course> getCoursesByName(String name);
    public List<Course> getCoursesByTeacherId(int id);
    public List<Course> getCoursesByTeacherNameBad(String tname);
    public List<Course> getAll();

    public List<Teacher> getTeachersByCourseId(String id);
    public List<Student> getStudentsByCourseId(String id);

}
