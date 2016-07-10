package serviceImpl;

import dao.StudentDao;
import dao.TeamApplicationDao;
import dao.TeamDao;
import dao.TeamingDao;
import model.Student;
import model.Team;
import model.TeamApplication;
import model.Teaming;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.StudentTeamService;

import java.util.List;

/**
 * Created by Mouze on 2016/7/10.
 */
@Service
public class StudentTeamServiceImpl implements StudentTeamService {
    @Autowired
    private TeamApplicationDao teamApplicationDao;
    @Autowired
    private StudentDao studentDao;
    @Autowired
    private TeamDao teamDao;
    @Autowired
    private TeamingDao teamingDao;
    @Override
    public List<Student> getStudentsInTeam(String team_id) {
        return null;
    }

    @Override
    public Team getStudentTeamInCourse(String course_id, String student_id) {
        return null;
    }

    @Override
    public List<Team> getAllTeamsUnderCourse(String course_id) {
        return null;
    }

    @Override
    public boolean canStudentCreateTeamInCourse(String course_id, String student_id) {
        return false;
    }

    @Override
    public boolean createTeamInCourse(Team team, String course_id) {
        return false;
    }

    @Override
    public boolean applyForTeam(String studentId, String teamId) {
        Student user=studentDao.getStudentById(studentId);
        TeamApplication apply= new TeamApplication();
        apply.setCourseId(teamDao.get(teamId).getCourseId());
        apply.setStudentId(user.getId());
        apply.setRealName(user.getRealName());
        apply.setTeamId(teamId);
        teamApplicationDao.save(apply);
        return true;
    }

    @Override
    public boolean permitapply(String applyId) {
        TeamApplication acc=teamApplicationDao.get(applyId);
        Teaming tem=new Teaming();
        tem.setStudentId(acc.getStudentId());
        tem.setTeamId(acc.getTeamId());
        teamingDao.save(tem);
        List<TeamApplication> applist=teamApplicationDao.searchApplicationByCourseId(acc.getCourseId());
        teamApplicationDao.deleteAll(applist);
        return true;
    }

    @Override
    public List<TeamApplication> consultapply(String teamId) {
        return teamApplicationDao.searchApplicationByTeamId(teamId);
    }

    @Override
    public boolean denyapply(String id) {
        teamApplicationDao.deleteByKey(id);
        return true;
    }
}
