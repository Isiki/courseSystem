package service;
import model.Team;
import model.Team;

import java.util.List;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamService {
    public String createTeam( String course_id, String student_id,String team_name,String description);


    public Team searchTeamById(String team_id,String course_id);

    public Team searchTeamByName(String name,String course_id);

    public List<Team> getTeamsInCourse(String course_id);

    public String joinTeam(String team_id,String course_id,String student_id);

}
