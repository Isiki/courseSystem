package dao;
import model.Team;

import java.util.List;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamDao {
    public String createTeam(Team team);
    public Team getTeamById(String id,String course_id);
    public Team getTeamByName(String name,String course_id);
    public List<Team> getTeamsById(String id,String course_id);
    public List<Team> getTeamsByName(String name,String course_id);
    public List<Team> getTeamsInCourse(String course_id);
    public String joinTeam(String  team_id,String course_id,String student_id);
}
