package serviceImpl;

import dao.PersonalAssignmentAnswerDao;
import dao.TeamAssignmentAnswerDao;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
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
        if(null!=personalAssignmentAnswerDao.get(assignmentAnswer.getAssignmentId())) {
            personalAssignmentAnswerDao.saveOrUpdate(assignmentAnswer);
        }else{
            return;
        }

    }

    @Override
    public void commentAssignment(TeamAssignmentAnswer assignmentAnswer) {
        if (null != teamAssignmentAnswerDao.get(assignmentAnswer.getAssignmentId())) {
            teamAssignmentAnswerDao.saveOrUpdate(assignmentAnswer);
        } else {
            return;
        }
    }
}
