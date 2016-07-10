package daoImpl;

import dao.TeacherDao;
import model.Course;
import model.Teacher;
import model.Team;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.hibernate.SessionFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by andyz_000 on 2016/7/4.
 */
@Repository("TeacherDao")
public class TeacherDaoImpl extends DaoImpl<Teacher,String> implements TeacherDao{
    @Autowired
    private SessionFactory sessionFactory;

    public List<Teacher> getAllTeachers(){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM teacher")
                .addEntity(Teacher.class);
        List<Teacher> teachers;
        try {
            teachers = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return new ArrayList<Teacher>();
        }
        return teachers;
    }

    public List<Course> getCourses(String teacher_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT course.* FROM  course INNER JOIN teaching ON course.id = teaching.course_id WHERE teacher_id = \'"+teacher_id +"\'")
                .addEntity(Course.class);
        List<Course> courses;
        try {
            courses = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return new ArrayList<Course>();
        }
        return courses;
    }
}
