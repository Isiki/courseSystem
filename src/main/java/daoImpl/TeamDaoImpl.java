package daoImpl;

import dao.TeamDao;
import model.Teaming;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.Team;

import java.util.ArrayList;
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
                .createSQLQuery("SELECT * FROM Team WHERE id=\'"+team.getId()+"\' AND course_id=\'"+team.getCourseId()+"\'").addEntity(Team.class);
        Query query2=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE teamleader_id = \'"+team.getTeamleaderId()+"\' AND course_id = \'"+team.getCourseId()+"\'").addEntity(Team.class);
        if(query1.list()==null || query2.list()==null)
        {
            sessionFactory.getCurrentSession().save(team);
            return  "success";
        }
        else
            return "error";
    }

    public Team getTeamById(String id,String course_id){
        List<Team> tm = getTeamsById(id,course_id);
        if(tm.isEmpty()) return null;
        return tm.get(0);

    }
    public Team getTeamByName(String name,String course_id){
        List<Team> tm = getTeamsByName(name,course_id);
        if(tm.isEmpty()) return null;
        return tm.get(0);
    }

    public List<Team> getTeamsById(String id,String course_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE id=\'"+id+"\'AND course_id=\'"+course_id+"\'")
                .addEntity(Team.class);

        List<Team> tm;
        try {
            tm = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return new ArrayList<Team>();
        }
        return tm;
    }

    public List<Team> getTeamsByName(String name,String course_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE team_name=\'"+name+"\'AND course_id=\'"+course_id+"\'")
                .addEntity(Team.class);

        List<Team> tm;
        try {
            tm = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return new ArrayList<Team>();
        }
        return tm;
    }


    public List<Team> getTeamsInCourse(String course_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM Team WHERE course_id=\'"+course_id+"\'")
                .addEntity(Team.class);

        List<Team> tm;
        try {
            tm = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return new ArrayList<Team>();
        }
        return tm;
    }

    public String joinTeam(String  team_id,String course_id,String student_id){
        Query query1 = sessionFactory.getCurrentSession().createSQLQuery("SELECT id,course_id,teamleader_id,team_name,team_description,is_full FROM team INNER JOIN teaming ON team.id = teaming.team_id WHERE course_id=\'"+course_id+"\'AND student_id=\'"+student_id+"\'")
                .addEntity(Team.class);
        Query query2=sessionFactory.getCurrentSession().createSQLQuery("SELECT * FROM team INNER JOIN course ON team.course_id=course.id WHERE (SELECT count(student_id) FROM teaming WHERE team_id=\'"+team_id+"\') < team_max_number" )
                .addEntity(Team.class);
        List<Team> tm;
        tm = query2.list();
        if(query1.list()==null || tm.get(0).getIsFull()==false){
            Teaming teaming=new Teaming();
            teaming.setStudentId(student_id);
            teaming.setTeamId(team_id);
            sessionFactory.getCurrentSession().save(teaming);
            return  "success";
        }
        return "error";
    }
}
