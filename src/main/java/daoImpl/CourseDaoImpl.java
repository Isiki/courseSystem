package daoImpl;

import dao.CourseDao;
import model.Course;
import model.Student;
import model.Teacher;
import org.hibernate.HibernateException;
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
        Course cs;
        try{
            cs = (Course)sessionFactory.getCurrentSession().get(Course.class, id);
        }catch (HibernateException e){
            e.printStackTrace();
            return null;
        }
        return cs;
    }

    public Course getCourseByName(String name) {
        List<Course> cl = getCoursesByName(name);
        if(cl == null) return null;
        return cl.get(0);
    }

    public Course getCourseByTeacherId(int id) {
        List<Course> cl = getCoursesByTeacherId(id);
        if(cl == null) return null;
        return cl.get(0);
    }

    public List<Course> getCoursesByName(String name) {
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Course WHERE name= '"+name+"\'")
                .addEntity(Course.class);
        // TODO: fix injection problem (HQL instead)
        List<Course> css;
        try {
             css = query.list();
        } catch (HibernateException e) {
            e.printStackTrace();
            return null;
        }
        return css;
    }

    public List<Course> getCoursesByTeacherId(int id) {
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Course WHERE teacher_id=\'"+id+"\'")
                .addEntity(Course.class);

        // TODO: fix injection problems (HQL instead)
        List<Course> css;
        try {
            css = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return null;
        }
        return css;
    }

    // bad implementations below
    // TODO: try join with dao & HQL

    public List<Course> getAll(){
        Query query = sessionFactory.getCurrentSession().createSQLQuery("SELECT * FROM Course").addEntity(Course.class);
        return query.list();
    }

    public List<Course> getCoursesByTeacherNameBad(String tname){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("select course.id, course_name, team_allowed, team_min_member, team_max_number from course left join teaching on course.id=teaching.course_id left join teacher on teaching.teacher_id=teacher.id where teacher.real_name=\'"+tname+"\'")
                .addEntity(Course.class);

        return query.list();
    }

    public List<Teacher> getTeachersByCourseId(String id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("select teacher.id, teacher.real_name from course left join teaching on course.id=teaching.course_id left join teacher on teaching.teacher_id=teacher.id where course.id=\'"+id+"\'")
                .addEntity(Teacher.class);

        List<Teacher> tcs;
        try{
            tcs = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return null;
        }
        return tcs;
    }

    public List<Student> getStudentsByCourseId(String id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("select student.id, student.real_name from course left join selection on course.id=selection.course_id left join student on selection.student_id=student.id where course.id=\'"+id+"\'")
                .addEntity(Student.class);

        List<Student> sts;
        try{
            sts = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return null;
        }
        return sts;
    }
}
