package service;

import model.Course;
import model.Student;
import model.Teacher;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/4.
 */
public interface CourseService {

    public List<Course> getAllCourses();

    public Course searchCourseByName(String name);

    public Course searchCourseByTeacherName(String teacher);

    public Course searchCourseById(String id);

    public List<Teacher> getTeachers(String id);

    public List<Student> getStudents(String id);
}
