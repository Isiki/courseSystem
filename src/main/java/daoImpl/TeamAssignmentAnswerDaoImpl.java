package daoImpl;

import dao.Dao;
import dao.TeamAssignmentAnswerDao;
import model.PersonalAssignmentAnswer;
import model.Team;
import model.TeamAssignmentAnswer;
import model.TeamAssignmentAnswerPK;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
@Repository("TeamAssignmentAnswerDao")
public class TeamAssignmentAnswerDaoImpl extends DaoImpl<TeamAssignmentAnswer, TeamAssignmentAnswerPK> implements TeamAssignmentAnswerDao{
    @Autowired
    private SessionFactory sessionFactory;

    public List<TeamAssignmentAnswer> getAnswerByAssignmentId(String assignmentId) {
        if (assignmentId!=null)
        {
            String hql="from TeamAssignmentAnswer n where n.assignmentId=?";
            List<Object> params = new ArrayList<Object>(0);
            params.add(assignmentId);
            return super.hqlFind(hql,params.toArray(),false);
        }
        return null;
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
