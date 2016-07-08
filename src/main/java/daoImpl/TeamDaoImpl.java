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

    public int createTeam(Team team) {
        sessionFactory.getCurrentSession().save(team);
        return 0;
    }

    public Team getTeamById(String id){
        return (Team)sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE id="+id)
                .addEntity(Team.class);
    }
    public Team getTeamByName(String name){
        return (Team)sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE team_name="+name)
                .addEntity(Team.class);
    }
    public List<Team> getTeamInCourse(String course_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * from Team where course_id="+course_id)
                .addEntity(Team.class);

        return query.list();
    }
}
