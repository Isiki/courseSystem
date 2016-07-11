package daoImpl;

import dao.TeamDao;
import model.Student;
import model.Teaming;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.Team;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
@Repository("TeamDao")
public class TeamDaoImpl extends DaoImpl<Team,String> implements TeamDao{
    @Autowired
    private SessionFactory sessionFactory;
   /*
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
    */
   public Team getStudentTeamInCourse(String course_id,String student_id){
       List<Team> tm = getStudentTeamsInCourse(course_id,student_id);
       if(tm.isEmpty()) return null;
       return tm.get(0);
   }

   public List<Team> getStudentTeamsInCourse(String course_id,String student_id){
       Query query = sessionFactory.getCurrentSession()
               .createSQLQuery("SELECT id,course_id,teamleader_id,team_name,team_description,is_full FROM team " +
                       "INNER JOIN teaming ON team.id = teaming.team_id WHERE course_id = \'"
                       +course_id+"\'AND student_id = \'"+student_id+"\'")
               .addEntity(Team.class);
       List<Team> tm = query.list();
       try {
           tm = query.list();
       } catch (HibernateException e){
           e.printStackTrace();
           return new ArrayList<Team>();
       }
       return tm;

   }

    public List<Student> getStudentsInTeam(String team_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT student.* FROM student INNER JOIN teaming " +
                        "ON student.id = teaming.student_id WHERE team_id = \'"+team_id+"\'")
                .addEntity(Student.class);
        List<Student> st = query.list();
        try {
            st = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return new ArrayList<Student>();
        }
        return st;
    }

    public List<Team> getAllTeamsUnderCourse(String course_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT team.* FROM team " +
                        "INNER JOIN course ON team.course_id = course.id WHERE course_id = \'"+course_id+"\'")
                .addEntity(Team.class);
        List<Team> tm = query.list();
        try {
            tm = query.list();
        } catch (HibernateException e){
            e.printStackTrace();
            return new ArrayList<Team>();
        }
        return tm;
    }

    public boolean canStudentCreateTeamInCourse(String course_id,String student_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM teaming INNER JOIN team ON teaming.team_id = team.id " +
                        "INNER JOIN course ON team.course_id = course.id " +
                        "WHERE course_id = \'"+course_id +"\'AND student_id = \'"+student_id+"\'");
        if(query.list().isEmpty())
            return true;
        return false;
    }

    public boolean createTeamInCourse(Team team, String course_id){
        sessionFactory.getCurrentSession().save(team);
        Teaming teaming = new Teaming();
        teaming.setTeamId(team.getId());
        teaming.setStudentId(team.getTeamleaderId());
        sessionFactory.getCurrentSession().save(teaming);
        return true;
    }

    public String getTeamIdByStudent(String student_id){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM teaming WHERE student_id = \'"+student_id+"\'")
                .addEntity(Teaming.class);
        List<Teaming> teamming = query.list();
        return teamming.get(0).getTeamId();
    }

    public String isTeamLeader(String sid,String cid){
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM team WHERE course_id = \'"
                        +cid+"\'AND teamleader_id = \'"+sid +"\'")
                .addEntity(Team.class);
        String isTeamLeader;
        if(query.list().isEmpty())
            isTeamLeader= "false";
        else  isTeamLeader = "true";

        return  isTeamLeader;
    }

    public List<Map<String,Object>> getAllTeamWithLeaders(String course_id){
        Query query=sessionFactory.getCurrentSession().createSQLQuery("select team.id,team.course_id,team.teamleader_id,team.team_name,team.team_description,team.is_full,student.real_name from team inner  join student on student.id=team.teamleader_id inner join course on course.id=team.course_id where course_id=\'"+course_id+"\'");
        List<Object[]> teamResult = query.list();
        List<Map<String, Object>> targetList= new ArrayList<>();
        for(Object[] line : teamResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("team_id", line[0]);
            tmp.put("course_id", line[1]);
            tmp.put("teamleader_id", line[2]);
            tmp.put("team_name", line[3]);
            tmp.put("team_description", line[4]);
            tmp.put("is_full", line[5]);
            tmp.put("teamleader_name", line[6]);


            targetList.add(tmp);
        }

        return targetList;
    }
}
