package serviceImpl;

import dao.CourseDao;
import dao.StudentDao;
import dao.TeacherDao;
import model.Course;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.CourseService;

import java.util.List;


/**
 * Created by ElaineC on 2016/7/4.
 */
@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseDao courseDao;

    public List<Course> getAllCourses(){
        List<Course> course=courseDao.getAll();
        return course;
    }
/*
    public String addCourse(String name, boolean team_allowed, String team_min_member, String team_max_member) {
        Course course=new Course();
        course.setCourseName(name);
        course.setTeamAllowed(team_allowed);
        course.setTeamMinMember(team_min_member);
        course.setTeamMaxNumber(team_max_member);
        //course.setTeacher(teacher);
        courseDao.addCourse(course);
        return "success";
    }
*/
    public String editCourseName(String id,String name) {
        Course course=courseDao.getCourseById(id);
        course.setCourseName(name);
        courseDao.updateCourse(course);
        return "success";
    }
/*
    public String editCourseTeacher(int id,int teacherId) {
        Course course=courseDao.getCourseById(id);
        //course.setTeacher(teacherId);
        return "success";
    }

    public String editCourseDescription(int id,String info) {
        Course course=courseDao.getCourseById(id);
        //course.setDescription(info);
        return "success";
    }

    public String deleteCourse(int id) {
        courseDao.delCourse(id);
        return "success";
    }

    public Course searchCourseByName(String name) {
        Course course=courseDao.getCourseByName(name);
        return course;
    }

    public List<Course> searchCoursesByNameString (String name){
        List<Course> course=courseDao.getCoursesByName(name);
        return course;
    }

    public Course searchCourseById(int id) {
        Course course=courseDao.getCourseById(id);
        return course;
    }


    public Course searchCourseByTeacherName(String name) {
        List<Course> course=courseDao.getCoursesByTeacherNameBad(name);
        return course.get(0);

    }
    public List<Course> searchCoursesByTeacherName(String name){
        List<Course> course=courseDao.getCoursesByTeacherNameBad(name);
        return course;
    }
*/
}
