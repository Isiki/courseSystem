package service;

import model.Course;
import model.Student;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by isiki on 2016/7/3.
 */
public interface StudentService {
    public List<Student> getAllStudents();
    public Student getStudentById(String id);
    public Student getStudentByName(String name);
    public ArrayList<Course> getAllCourseById(String id);

}
