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

    public String createTeam(  String course_id, String student_id,String team_name,String description){

            Team team=new Team();

            team.setCourseId(course_id);
            team.setTeamleaderId(student_id);
            team.setTeamDescription(description);
            team.setTeamName(team_name);
            String result =teamDao.createTeam(team);
            return  result;
    }

    public Team searchTeamByName(String name,String course_id){
        Team team=teamDao.getTeamByName(name,course_id);
        return team;
    }

    public Team searchTeamById(String id,String course_id){
        Team team=teamDao.getTeamById(id,course_id);
        return team;
    }

    public List<Team> getTeamsInCourse(String course_id){
        List<Team> team=teamDao.getTeamsInCourse(course_id);
        return team;
    }

    public String joinTeam(String team_id,String course_id,String student_id){
        String result = teamDao.joinTeam(team_id,course_id,student_id);
        return result;
    }

}
