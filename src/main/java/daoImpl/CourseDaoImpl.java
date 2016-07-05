package daoImpl;

import dao.CourseDao;
import model.Course;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/5.
 */

public class CourseDaoImpl implements CourseDao{

    @Autowired
    private SessionFactory sessionFactory;

    public int addCourse(Course course) {
        return (int)sessionFactory.getCurrentSession().save(course);
    }

    public void delCourse(int id) {
        sessionFactory.getCurrentSession();
    }

    public Course getCourseById(int id) {
        return (Course)sessionFactory.getCurrentSession().get(Course.class, id);
    }

    public Course getCourseByName(String name) {
        return getCoursesByName(name).get(0);
    }

    public Course getCourseByTeacherId(int id) {
        return getCoursesByTeacherId(id).get(0);
    }

    public List<Course> getCoursesByName(String name) {
        Query query = sessionFactory.getCurrentSession().createSQLQuery("SELECT * FROM Course WHERE name=="+name);
        // TODO: fix injection problem (HQL instead)

        List<Course> css = query.list();
        return css;
    }

    public List<Course> getCoursesByTeacherId(int id) {
        Query query = sessionFactory.getCurrentSession().createSQLQuery("SELECT * FROM Course WHERE teacher_id=="+id);
        // TODO: fix injection problems (HQL instead)

        List<Course> css = query.list();
        return css;
    }
}
