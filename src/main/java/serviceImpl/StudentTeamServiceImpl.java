package serviceImpl;

import dao.StudentDao;
import dao.TeamApplicationDao;
import dao.TeamDao;
import dao.TeamingDao;
import model.*;
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
    public boolean canStudentCreateTeamInCourse(String course_id, String student_id) {
        boolean bool=teamDao.canStudentCreateTeamInCourse(course_id,student_id);
        return bool;
    }

    @Override
    public boolean createTeamInCourse(Team team, String course_id) {
        boolean bool = teamDao.createTeamInCourse(team, course_id);
        return bool;
    }

    @Override
    public boolean applyForTeam(String studentId, String teamId, String description) {
        Student user=studentDao.getStudentById(studentId);
        TeamApplication apply= new TeamApplication();
        apply.setCourseId(teamDao.get(teamId).getCourseId());
        TeamApplicationPK pk=new TeamApplicationPK();
        pk.setTeamId(teamId);
        pk.setStudentId(studentId);
        apply.setRealName(user.getRealName());
        apply.setTeamApplicationPK(pk);
        apply.setDescription(description);
        if(teamApplicationDao.get(pk)!=null)
        {
            return false;
        }
        teamApplicationDao.save(apply);
        return true;
    }

    @Override
    public boolean permitapply(TeamApplicationPK pk) {
        TeamApplication acc=teamApplicationDao.get(pk);
        Teaming tem=new Teaming();
        tem.setStudentId(acc.getTeamApplicationPK().getStudentId());
        tem.setTeamId(acc.getTeamApplicationPK().getTeamId());
        teamingDao.save(tem);
        List<TeamApplication> applist=teamApplicationDao.searchApplicationByCourseId(pk.getStudentId(), acc.getCourseId());
        teamApplicationDao.deleteAll(applist);
        return true;
    }

    @Override
    public List<TeamApplication> consultapply(String teamId) {
        return  teamApplicationDao.searchApplicationByTeamId(teamId);
    }

    @Override
    public boolean denyapply(TeamApplicationPK pk) {
        teamApplicationDao.deleteByKey(pk);
        return true;
    }
    @Override
    public String isTeamLeader(String sid,String cid){
        String isTeamLeader = teamDao.isTeamLeader(sid,cid);
        return  isTeamLeader;
    }

    @Override
    public void clearTeamAppByStudentId(String studentId,String courseId) {
        List<TeamApplication> applist=teamApplicationDao.searchApplicationByCourseId(studentId, courseId);
        teamApplicationDao.deleteAll(applist);
    }
}
