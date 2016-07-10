package service;

import model.Course;
import model.Student;
import model.Teacher;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/4.
 */
public interface CourseService {

    List<Course> getAllCourses();

    Course searchCourseByName(String name);

    Course searchCourseByTeacherName(String teacher);

    Course searchCourseById(String id);

    List<Teacher> getTeachers(String id);

    List<Student> getStudents(String id);
    Course getCourseById(String course_id);

}
