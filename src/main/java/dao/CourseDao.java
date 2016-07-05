package dao;

import model.Course;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/4.
 */
public interface CourseDao {

    public int addCourse(Course course);
    public void delCourse(int id);
    public Course getCourseById(int id);
    public Course getCourseByName(String name);
    public Course getCourseByTeacherId(int id);

    public List<Course> getCoursesByName(String name);
    public List<Course> getCoursesByTeacherId(int id);
}
