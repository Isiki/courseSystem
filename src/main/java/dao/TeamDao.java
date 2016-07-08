package dao;
import model.Team;

import java.util.List;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamDao {
    public int createTeam(Team team);
    public Team getTeamById(String id);
    public Team getTeamByName(String name);
    public List<Team> getTeamInCourse(String course_id);
}
