package daoImpl;

import dao.AssignmentAnswerDao;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
@Repository("AssignmentAnswerDao")
public class AssignmentAnswerDaoImpl implements AssignmentAnswerDao{
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

    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM  teamassignmentanswer WHERE  team_id=\'"+id+"\'")
                .addEntity(TeamAssignmentAnswer.class);
        return query.list();
    }

    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT team_id,assignment_id,is_submitted,submit_time,text,attachment_url FROM teamassignmentanswer INNER JOIN assignment ON teamassignmentanswer.assignment_id = assignment.id WHERE assignment.course_id=\'"+id+"\'")
                .addEntity(TeamAssignmentAnswer.class);
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


    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByTeam(String TeamId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT team_id,assignment_id,is_submitted,submit_time,text,attachment_url FROM assignment inner JOIN team ON team.course_id=assignment.course_id LEFT JOIN teamassignmentanswer ON assignment.id = teamassignmentanswer.assignment_id AND team.id=teamassignmentanswer.team_id WHERE assignment_id is NULL AND assignment.is_teamwork=1 and start_time<now() and now()<end_time AND teamassignmentanswer.team_id=\'" +TeamId+"\'")
                .addEntity(TeamAssignmentAnswer.class);
        return query.list();
    }

    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByCourseId(String courseId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT team_id,assignment_id,is_submitted,submit_time,text,attachment_url FROM assignment inner JOIN team ON team.course_id=assignment.course_id LEFT JOIN teamassignmentanswer ON assignment.id = teamassignmentanswer.assignment_id AND team.id=teamassignmentanswer.team_id WHERE assignment_id is NULL AND assignment.is_teamwork=1 and start_time<now() and now()<end_time and assignment.course_id=\'"+courseId+"'\'")
                .addEntity(TeamAssignmentAnswer.class);
        return query.list();

    }


}
