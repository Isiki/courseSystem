package service;

import model.Course;

/**
 * Created by ElaineC on 2016/7/4.
 */
public interface CourseService {
    public String addCourse(String name, int id, int teacher, String desc);

    public String editCourseName(int id, String name);

    public String editCourseTeacher(int id, int teacherId);

    public String editCourseDescription(int id, String info);

    public String deleteCourse(int id);

    public Course searchCourseByName(String name);

    public Course searchCourseById(int courseId);

    public Course searchCourseByTeacherName(String name);
}
