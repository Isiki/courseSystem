package service;

import model.Course;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/4.
 */
public interface CourseService {

    public String editCourseName(String id, String name);

    public List<Course> getAllCourses();

    /*
    public String addCourse(String name, boolean team_allowed, String team_min_member, String team_max_member);

    public String editCourseTeacher(int id, int teacherId);

    public String editCourseDescription(int id, String info);

    public String deleteCourse(int id);

    public Course searchCourseByName(String name);

    public List<Course> searchCoursesByNameString (String name);

    public Course searchCourseById(int courseId);

    public Course searchCourseByTeacherName(String name);

    public List<Course> searchCoursesByTeacherName(String name);
    */
}
