package daoImpl;

import dao.TeamDao;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.Team;

import java.util.List;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
@Repository("TeamDao")
public class TeamDaoImpl implements TeamDao{
    @Autowired
    private SessionFactory sessionFactory;

    public String createTeam(Team team) {
        Query query1=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE id=\'"+team.getId()+"\' AND course_id=\'"+team.getCourseId()+"\'")
                .addEntity(Team.class);
        Query query2=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE teamleader_id = \'"+team.getTeamleaderId()+"\' AND course_id = \'"+team.getCourseId()+"\'")
                .addEntity(Team.class);
        if(query1==null && query2==null)
        {
            sessionFactory.getCurrentSession().save(team);
            return  "success";
        }
        else
            return "error";
    }

    public Team getTeamById(String id,String course_id){
        return (Team)sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE id=\'"+id+"\'AND course_id=\'"+course_id+"\'")
                .addEntity(Team.class);
    }
    public Team getTeamByName(String name,String course_id){
        return (Team)sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE team_name=\'"+name+"\'AND course_id=\'"+course_id+"\'")
                .addEntity(Team.class);
    }
    public List<Team> getTeamInCourse(String course_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE course_id=\'"+course_id+"\'")
                .addEntity(Team.class);

        return query.list();
    }
}
