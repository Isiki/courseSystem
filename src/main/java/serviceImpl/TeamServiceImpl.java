package serviceImpl;

import dao.TeamDao;
import model.Team;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.TeamService;

import java.util.List;


/**
 * Created by 陌上花开 on 2016/7/5.
 */
@Service
public class TeamServiceImpl implements TeamService {
    @Autowired
    private TeamDao teamDao;

    public String createTeam( String teamid, String course_id, String student_id,String team_name,String description){

            Team team=new Team();
            team.setId(teamid);
            team.setCourseId(course_id);
            team.setTeamleaderId(student_id);
            team.setTeamDescription(description);
            team.setTeamName(team_name);
            teamDao.createTeam(team);
            return  "success";

    }

    public Team searchTeamByName(String name){
        Team team=teamDao.getTeamByName(name);
        return team;
    }

    public Team searchTeamById(String id){
        Team team=teamDao.getTeamById(id);
        return team;
    }

    public List<Team> getTeamsInCourse(String course_id){
        List<Team> team=teamDao.getTeamInCourse(course_id);
        return team;
    }

}
