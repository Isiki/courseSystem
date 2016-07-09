package daoImpl;

import dao.StudentDao;
import model.Course;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.Student;

import java.util.List;

/**
 * Created by isiki on 2016/7/3.
 */
@Repository("StudentDao")
public class StudentDaoImpl implements StudentDao{
    @Autowired
    private SessionFactory sessionFactory;
    public List<Student> getAllStudents(){
        Query query = sessionFactory.getCurrentSession().createSQLQuery("select * FROM student").addEntity(Course.class);
        return query.list();
    }

    public Student getStudentById(String id) {
        Student student= (Student) sessionFactory.getCurrentSession().get(Student.class,id);
        return student;
    }

    public Student getStudentByName(String name){
        Student student=(Student) sessionFactory.getCurrentSession().get(Student.class,name);
        return student;
    }
}
