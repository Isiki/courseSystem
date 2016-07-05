package daoImpl;

import dao.CourseDao;
import model.Course;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/5.
 */
@Repository("CourseDao")
public class CourseDaoImpl implements CourseDao{

    @Autowired
    private SessionFactory sessionFactory;

    public int addCourse(Course course) {
        return (int)sessionFactory.getCurrentSession().save(course);
    }

    public void updateCourse(Course course){
        sessionFactory.getCurrentSession().saveOrUpdate(course);
    }
    public void delCourse(int id) {
        sessionFactory.getCurrentSession();
    }

    public Course getCourseById(String id) {
        return (Course)sessionFactory.getCurrentSession().get(Course.class, id);
    }

    public Course getCourseByName(String name) {
        return getCoursesByName(name).get(0);
    }

    public Course getCourseByTeacherId(int id) {
        return getCoursesByTeacherId(id).get(0);
    }

    public List<Course> getCoursesByName(String name) {
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Course WHERE name=="+name)
                .addEntity(Course.class);
        // TODO: fix injection problem (HQL instead)
        List<Course> css = query.list();
        return css;
    }

    public List<Course> getCoursesByTeacherId(int id) {
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Course WHERE teacher_id=="+id)
                .addEntity(Course.class);
        // TODO: fix injection problems (HQL instead)

        List<Course> css = query.list();
        return css;
    }

    // bad implementations below
    // TODO: try join with dao & HQL

    public List<Course> getAll(){
        Query query=sessionFactory.getCurrentSession().createSQLQuery("SELECT * FROM Course").addEntity(Course.class);
        return query.list();
    }

    public List<Course> getCoursesByTeacherNameBad(String tname){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("select course.id, course_name, team_allowed, team_min_member, team_max_number from course left join teaching on course.id=teaching.course_id left join teacher on teaching.teacher_id=teacher.id where teacher.real_name=\'"+tname+"\'")
                .addEntity(Course.class);

        return query.list();
    }
}
