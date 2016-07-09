package daoImpl;

import dao.PersonalAssignmentAnswerDao;
import model.PersonalAssignmentAnswer;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public class PersonalAssignmentAnswerDaoImpl extends DaoImpl<PersonalAssignmentAnswer,String> implements PersonalAssignmentAnswerDao {
    @Autowired
    private SessionFactory sessionFactory;


    public List<PersonalAssignmentAnswer> getPersonalAnswerByStudentId(String id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM personalassignmentanswer WHERE student_id = \'"+id+"\'")
                .addEntity(PersonalAssignmentAnswer.class);
        return query.list();
    }

    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT student_id,assignment_id,is_submitted,submit_time,text,attachment_url FROM personalassignmentanswer INNER JOIN  assignment ON personalassignmentanswer.assignment_id = assignment.id WHERE assignment.course_id=\'"+id+"\'")
                .addEntity(PersonalAssignmentAnswer.class);
        return query.list();

    }

    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT student_id,assignment_id,is_submitted,submit_time,text,attachment_url FROM assignment INNER JOIN selection ON  assignment.course_id=selection.course_id LEFT JOIN personalassignmentanswer ON personalassignmentanswer.student_id=selection.student_id AND personalassignmentanswer.assignment_id=assignment.id WHERE is_teamwork=0 AND assignment_id is NULL AND student_id=\'"+studentId+"\'AND start_time<now() AND now()<assignment.end_time")
                .addEntity(PersonalAssignmentAnswer.class);
        return query.list();
    }

    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByCourseId(String courseId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT student_id,assignment_id,is_submitted,submit_time,text,attachment_url FROM assignment INNER JOIN selection ON  assignment.course_id=selection.course_id LEFT JOIN personalassignmentanswer ON personalassignmentanswer.student_id=selection.student_id AND personalassignmentanswer.assignment_id=assignment.id WHERE is_teamwork=0 AND assignment_id is NULL AND assignment.course_id=\'"+courseId+"\'AND start_time<now() AND now()<assignment.end_time")
                .addEntity(PersonalAssignmentAnswer.class);
        return query.list();
    }

    @Override
    public List<PersonalAssignmentAnswer> getAnswerByAssignmentId(String assignmentId) {
        if (assignmentId!=null)
        {
            String hql="from PersonalAssignmentAnswer n where n.assignmentId=?";
            List<Object> params = new ArrayList<Object>(0);
            params.add(assignmentId);
            return super.hqlFind(hql,params.toArray(),false);
        }
        return null;
    }
}
