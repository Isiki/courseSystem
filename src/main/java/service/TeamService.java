package service;
import model.Team;
import model.Team;

import java.util.List;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamService {
    public String createTeam( String teamid, String course_id, String student_id,String team_name,String description);

    public Team searchTeamByName(String name);

    public Team searchTeamById(String id);

    public List<Team> getTeamsInCourse(String course_id);

}
