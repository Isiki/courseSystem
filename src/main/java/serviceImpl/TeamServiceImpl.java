package serviceImpl;

import dao.TeamDao;
import model.Student;
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

    /*public String createTeam(  String course_id, String student_id,String team_name,String description){

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
    */
    @Override
    public List<Student> getStudentsInTeam(String team_id) {
        List<Student> students = teamDao.getStudentsInTeam(team_id);
        return  students;
    }

    @Override
    public Team getStudentTeamInCourse(String course_id, String student_id) {
        Team team = teamDao.getStudentTeamInCourse(course_id,student_id);
        return  team;
    }

    @Override
    public List<Team> getAllTeamsUnderCourse(String course_id) {
        List<Team> teams = teamDao.getAllTeamsUnderCourse(course_id);
        return teams;
    }

    @Override
    public String getTeamIdByStudent(String student_id){
        String team_id = teamDao.getTeamIdByStudent(student_id);
        return  team_id;
    }

}
