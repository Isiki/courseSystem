package serviceImpl;

import dao.CourseDao;
import dao.StudentDao;
import model.Course;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by ElaineC on 2016/7/4.
 */
public class CourseServiceImpl {

    @Autowired
    private CourseDao courseDao;

    public String addCourse(String name, int id, int teacher, String desc) {
        
    }

    public String editCourseName(String name) {

    }

    public String editCourseTeacher(int teacherId) {

    }

    public String editCourseDescription(String info) {

    }

    public String deleteCourse(int id) {

    }

    public Course searchCourseByName(String name) {

    }

    public Course searchCourseById(int courseId) {

    }

    public Course searchCourseByTeacher(String name) {

    }
}
