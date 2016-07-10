package daoImpl;

import dao.TeacherAssignmentDao;
import model.PersonalAssignmentAnswer;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/10.
 */
public class TeacherAssignmentDaoImpl implements TeacherAssignmentDao{
    @Autowired
    private SessionFactory sessionFactory;

    public List<PersonalAssignmentAnswer> getAllStudentSubmissions(String assignment_id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM personalassignmentanswer WHERE  assignment_id=\'"+assignment_id+"\'").addEntity(PersonalAssignmentAnswer.class);
        return query.list();
    }
}
