package serviceImpl;

import dao.CourseDao;
import dao.StudentDao;
import dao.TeacherDao;
import model.Course;
import model.Student;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.CourseService;

import java.util.List;
import java.util.Map;


/**
 * Created by ElaineC on 2016/7/4.
 */
@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseDao courseDao;

    public List<Course> getAllCourses(){
        List<Course> course = courseDao.getAll();
        return course;
    }


    public Course searchCourseByName(String name) {
        Course course = courseDao.getCourseByName(name);
        return course;
    }


    public Course searchCourseById(String id) {
        Course course=courseDao.getCourseById(id);
        return course;
    }


    public Course searchCourseByTeacherName(String name) {
        List<Course> course=courseDao.getCoursesByTeacherNameBad(name);
        return course.get(0);
    }

    public List<Teacher> getTeachers(String id)
    {
        return courseDao.getTeachersByCourseId(id);
    }

    public List<Student> getStudents(String id)
    {
        return courseDao.getStudentsByCourseId(id);
    }

    public Course getCourseById(String course_id){
        Course course = courseDao.getCourseById(course_id);
        return  course;
    }

    public List<Map<String,Object>> getCourseWithTeacherAndTeamAllowedByStudentId(String student_id){
        List<Map<String,Object>> list=courseDao.getCourseWithTeacherAndTeamAllowedByStudentId(student_id);
        return list;
    }
}
