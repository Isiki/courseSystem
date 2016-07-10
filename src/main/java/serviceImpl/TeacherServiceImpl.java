package serviceImpl;

import dao.TeacherDao;
import model.Course;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.TeacherService;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/4.
 */
@Service
public class TeacherServiceImpl implements TeacherService {
    @Autowired
    private TeacherDao teacherDao;

    public boolean teacherLogin(String id) {
        if(teacherDao.get(id)!=null){
            return true;
        }
        return false;
    }

    public Teacher getTeacherById(String id) {
        return teacherDao.get(id);
    }

    public List<Teacher> getAllTeachers(){
        List<Teacher> teachers = teacherDao.getAllTeachers();
        return  teachers;
    }

    public List<Course> getCourses(String teacher_id){
        List<Course> courses = teacherDao.getCourses(teacher_id);
        return courses;
    }
}
