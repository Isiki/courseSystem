package serviceImpl;

import dao.PersonalAssignmentAnswerDao;
import dao.TeamAssignmentAnswerDao;
import model.PersonalAssignmentAnswer;
import model.PersonalAssignmentAnswerPK;
import model.TeamAssignmentAnswer;
import model.TeamAssignmentAnswerPK;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.AssignmentAnswerService;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
@Service
public class AssignmentAnswerServiceImpl implements AssignmentAnswerService{

    @Autowired
    private PersonalAssignmentAnswerDao personalAssignmentAnswerDao;
    @Autowired
    private TeamAssignmentAnswerDao teamAssignmentAnswerDao;
    public List<PersonalAssignmentAnswer> getPersonalAnswerByStudentId(String id){
        return personalAssignmentAnswerDao.getPersonalAnswerByStudentId(id);
    }
    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id){
        return personalAssignmentAnswerDao.getPersonalAnswerByCourseId(id);
    }
    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id){
        return teamAssignmentAnswerDao.getTeamAnswerByTeamId(id);
    }
    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id){
        return  teamAssignmentAnswerDao.getTeamAnswerByCourseId(id);
    }
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId){
        return personalAssignmentAnswerDao.getPersonalAssignmentToBeSubmittedByStudent(studentId);
    }
    public List<PersonalAssignmentAnswer> getPersonalAssignmenToBeSubmittedByCourse(String course){
        return personalAssignmentAnswerDao.getPersonalAssignmentToBeSubmittedByCourseId(course);
    }
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByTeam(String teamId){
        return teamAssignmentAnswerDao.getTeamAssignmentToBeSubmittedByTeam(teamId);
    }
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByCourse(String courseId){
        return  teamAssignmentAnswerDao.getTeamAssignmentToBeSubmittedByCourseId(courseId);
    }

    @Override
    public void commentAssignment(PersonalAssignmentAnswer assignmentAnswer) {
        PersonalAssignmentAnswerPK pk= new PersonalAssignmentAnswerPK();
        pk.setStudentId(assignmentAnswer.getStudentId());
        pk.setAssignmentId(assignmentAnswer.getAssignmentId());
        if(null!=personalAssignmentAnswerDao.get(pk)) {
            personalAssignmentAnswerDao.saveOrUpdate(assignmentAnswer);
        }else{
            return;
        }

    }

    @Override
    public void commentAssignment(TeamAssignmentAnswer assignmentAnswer) {
        TeamAssignmentAnswerPK pk= new TeamAssignmentAnswerPK();
        pk.setTeamId(assignmentAnswer.getTeamId());
        pk.setAssignmentId(assignmentAnswer.getAssignmentId());
        if (null != teamAssignmentAnswerDao.get(pk)) {
            teamAssignmentAnswerDao.saveOrUpdate(assignmentAnswer);
        } else {
            return;
        }
    }

    @Override
    public List<TeamAssignmentAnswer> getTeamAnswerByAssignment(String id) {
        return teamAssignmentAnswerDao.getAnswerByAssignmentId(id);
    }

    @Override
    public List<PersonalAssignmentAnswer> getPersonalAnswerByAssignment(String id) {
        return personalAssignmentAnswerDao.getAnswerByAssignmentId(id);
    }

    @Override
    public TeamAssignmentAnswer getTeamAnswerByPK(TeamAssignmentAnswerPK pk) {
        return teamAssignmentAnswerDao.get(pk);
    }

    @Override
    public PersonalAssignmentAnswer getPersonalAnswerByPK(PersonalAssignmentAnswerPK pk) {
        return personalAssignmentAnswerDao.get(pk);
    }
}
