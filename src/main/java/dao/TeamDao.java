package dao;
import model.Student;
import model.Team;

import java.util.List;
import java.util.Map;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamDao extends Dao<Team,String>{

    /*
    public String createTeam(Team team);
    public Team getTeamById(String id,String course_id);
    public Team getTeamByName(String name,String course_id);
    public List<Team> getTeamsById(String id,String course_id);
    public List<Team> getTeamsByName(String name,String course_id);
    public List<Team> getTeamsInCourse(String course_id);
    public String joinTeam(String  team_id,String course_id,String student_id);
    */

    public Team getStudentTeamInCourse(String course_id,String student_id);
    public List<Team> getStudentTeamsInCourse(String course_id, String student_id);
    public List<Student> getStudentsInTeam(String team_id);
    public List<Team> getAllTeamsUnderCourse(String course_id);
    public boolean canStudentCreateTeamInCourse(String course_id,String student_id);
    public boolean createTeamInCourse(Team team, String course_id);
    public String getTeamIdByStudent(String student_id);
    public String  isTeamLeader(String sid,String cid);
    List<Map<String,Object>> getAllTeamWithLeaders(String course_id);

}
