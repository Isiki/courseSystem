package service;
import model.Course;
import model.Student;
import model.Team;
import model.TeamApplication;
import java.util.List;
import java.util.Map;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamService {

    /*
    public String createTeam( String course_id, String student_id,String team_name,String description);


    public Team searchTeamById(String team_id,String course_id);

    public Team searchTeamByName(String name,String course_id);

    public List<Team> getTeamsInCourse(String course_id);

    public String joinTeam(String team_id,String course_id,String student_id);
    */
    public String getTeamIdByStudent(String student_id);
    public List<Student> getStudentsInTeam(String team_id);
    public Team getStudentTeamInCourse(String course_id, String student_id);
    public List<Team> getAllTeamsUnderCourse(String course_id);

    List<Team> getStudentTeamsInCourse(String course_id, String student_id);
    List<Map<String,Object>> getAllTeamWithLeader(String course_id);
}
