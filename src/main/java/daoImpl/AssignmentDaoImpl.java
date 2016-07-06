package daoImpl;

import dao.AssignmentDao;
import model.Assignment;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/4.
 */
@Repository("AssignmentDao")
public class AssignmentDaoImpl implements AssignmentDao{
    @Autowired
    private SessionFactory sessionFactory;

    public Assignment getAssignmentById(String id) {
        Assignment assignment = (Assignment) sessionFactory.getCurrentSession().get(Assignment.class,id);
        return assignment;
    }

    public void insertAssignment(Assignment assignment) {
        sessionFactory.getCurrentSession().save(assignment);
    }

    public ArrayList<Assignment> getAllByCourseId(String id){
        String sql = "select * from assignment where course_id='"+id+"'";
        Query query = sessionFactory.getCurrentSession().createSQLQuery(sql).addEntity(Assignment.class);
        ArrayList<Assignment> assignments=(ArrayList<Assignment>)query.list();
        if (assignments==null)
            assignments = new ArrayList<Assignment>();
        return assignments;
    }
}
