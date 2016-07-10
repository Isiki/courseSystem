package service;
import model.Course;
import model.Student;
import model.Team;
import model.TeamApplication;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamService {
    String createTeam( String teamid, String course_id, String student_id,String team_name,String description);

}
