package daoImpl;

import dao.AssignmentComplexDao;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Mouze on 2016/7/10.
 */
@Repository("AssignmentComplexDao")
public class AssignmentComplexDaoImpl implements AssignmentComplexDao{

    @Autowired
    SessionFactory sessionFactory;

    @Override
    public List<Map<String, Object>> assignmentsWithSubmitStatus(String course_id, String student_id) {
        List<Object[]> t = null;
        try {
            t = DirtySQL("SELECT is_teamwork FROM assignment where course_id='" + course_id + "'");
        } catch (HibernateException e) {
            e.printStackTrace();
        }

        for(Object[] objects : t) {
            boolean isTeamWork = (boolean)objects[0];
            if(isTeamWork) {
                DirtySQL("select * from student " +
                        "inner join teaming on student.id = teaming.student_id " +
                        "inner join teamassignmentanswer on teamassignmentanswer.team_id = teaming.team_id" +
                        "where teamassignmentanswer.assignment_id = '"+)
            }
        }

    }

    private List<Object[]> DirtySQL(String sqlStr) throws HibernateException
    {
        try{
            List<Object[]> list = sessionFactory.getCurrentSession().createSQLQuery(sqlStr).list();
            return list;
        }
        catch (HibernateException e){
            e.printStackTrace();
            throw e;
        }
    }
}
