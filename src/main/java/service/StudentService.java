package service;

import model.Course;
import model.Student;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/3.
 */
public interface StudentService {
    Student getStudentById(String id);
    ArrayList<Course> getAllCourseById(String id);

}
