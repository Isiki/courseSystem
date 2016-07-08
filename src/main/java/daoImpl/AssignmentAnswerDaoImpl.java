package daoImpl;

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
public class AssignmentAnswerDaoImpl {
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
                .createSQLQuery("SELECT * FROM personalassignmentanswer INNER JOIN  assignment ON personalassignmentanswer.assignment_id = assignment.id WHERE assignment.course_id=\'"+id+"\'")
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
                .createSQLQuery("SELECT * FROM teamassignmentanswer INNER JOIN assignment ON teamassignmentanswer.assignment_id = assignment.id WHERE assignment.course_id=\'"+id+"\'")
                .addEntity(TeamAssignmentAnswer.class);
        return query.list();
    }

    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT assignment_id FROM personalassignmentanswer INNER JOIN assignment on  personalassignmentanswer.assignment_id = assignment.id WHERE personalassignmentanswer.student_id=\'"
                        +studentId
                        +"\'"
                        +"AND personalassignmentanswer.is_submitted=FALSE AND assignment.start_time<=now() AND now()<=assignment.end_time")
                .addEntity(PersonalAssignmentAnswer.class);
        return query.list();
    }

    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByCourseId(String courseId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT assignment_id FROM personalassignmentanswer INNER JOIN assignment on  personalassignmentanswer.assignment_id = assignment.id WHERE assignment.course_id=\'"
                        +courseId
                        +"\'"
                        +"AND personalassignmentanswer.is_submitted=FALSE AND assignment.start_time<=now() AND now()<=assignment.end_time")
                .addEntity(PersonalAssignmentAnswer.class);
        return query.list();
    }


    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByTeam(String TeamId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT assignment_id FROM teamassignmentanswer INNER JOIN assignment on  teamassignmentanswer.assignment_id = assignment.id WHERE teamassignmentanswer.team_id=\'"
                        +TeamId
                        +"\'"
                        +"AND teamassignmentanswer.is_submitted=FALSE AND assignment.start_time<=now() AND now()<=assignment.end_time")
                .addEntity(TeamAssignmentAnswer.class);
        return query.list();
    }

    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByCourse(String courseId){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT assignment_id FROM teamassignmentanswer INNER JOIN assignment on  teamassignmentanswer.assignment_id = assignment.id WHERE assignment.course_id=\'"
                        +courseId
                        +"\'"
                        +"AND teamassignmentanswer.is_submitted=FALSE AND assignment.start_time<=now() AND now()<=assignment.end_time")
                .addEntity(TeamAssignmentAnswer.class);
        return query.list();

    }
}
