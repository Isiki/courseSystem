package daoImpl;

import dao.StudentDao;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.Student;
/**
 * Created by isiki on 2016/7/3.
 */
@Repository("StudentDao")
public class StudentDaoImpl implements StudentDao{
    @Autowired
    private SessionFactory sessionFactory;
    public Student getStudentById(String id) {
        Student student= (Student) sessionFactory.getCurrentSession().get(Student.class,id);
        return student;
    }
}
