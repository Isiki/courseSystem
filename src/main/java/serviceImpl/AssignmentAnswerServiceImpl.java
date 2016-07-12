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

import java.util.Date;
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

    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id){
        return personalAssignmentAnswerDao.getPersonalAnswersByCourseId(id);
    }
    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id){
        return teamAssignmentAnswerDao.getTeamAnswerByTeamId(id);
    }
    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id){
        return  teamAssignmentAnswerDao.getTeamAnswerByCourseId(id);
    }
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId){
        return personalAssignmentAnswerDao.getPersonalAssignmentsToBeSubmittedByStudent(studentId);
    }
    public List<PersonalAssignmentAnswer> getPersonalAssignmenToBeSubmittedByCourse(String course){
        return personalAssignmentAnswerDao.getPersonalAssignmentsToBeSubmittedByCourseId(course);
    }
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByTeam(String teamId){
        return teamAssignmentAnswerDao.getTeamAssignmentToBeSubmittedByTeam(teamId);
    }
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByCourse(String courseId){
        return  teamAssignmentAnswerDao.getTeamAssignmentToBeSubmittedByCourseId(courseId);
    }

    @Override
    public boolean commentAssignment(PersonalAssignmentAnswer assignmentAnswer) {
        PersonalAssignmentAnswerPK pk= new PersonalAssignmentAnswerPK();
        pk.setStudentId(assignmentAnswer.getStudentId());
        pk.setAssignmentId(assignmentAnswer.getAssignmentId());
        if(null!=personalAssignmentAnswerDao.get(pk)) {
            //personalAssignmentAnswerDao.saveOrUpdate(assignmentAnswer);
            return personalAssignmentAnswerDao.UpdatePersonalGradeAndComment(
                    assignmentAnswer.getAssignmentId(),
                    assignmentAnswer.getStudentId(),
                    assignmentAnswer.getGrade(),
                    assignmentAnswer.getComment())==1;
        }else{
            return false;
        }

    }

    @Override
    public boolean commentAssignment(TeamAssignmentAnswer assignmentAnswer) {
        TeamAssignmentAnswerPK pk= new TeamAssignmentAnswerPK();
        pk.setTeamId(assignmentAnswer.getTeamId());
        pk.setAssignmentId(assignmentAnswer.getAssignmentId());
        if (null != teamAssignmentAnswerDao.get(pk)) {
            //teamAssignmentAnswerDao.saveOrUpdate(assignmentAnswer);
            return teamAssignmentAnswerDao.UpdateTeamGradeAndComment(
                    assignmentAnswer.getAssignmentId(),
                    assignmentAnswer.getTeamId(),
                    assignmentAnswer.getGrade(),
                    assignmentAnswer.getComment())==1;
        } else {
            return false;
        }
    }


    public boolean insertPAnswer(PersonalAssignmentAnswer answer) {
        answer.setIsSubmitted(true);
        answer.setSubmitTime(new Date());
        personalAssignmentAnswerDao.saveOrUpdate(answer);
        return true;
    }

    public boolean insertTAnswer(TeamAssignmentAnswer answer) {
        answer.setIsSubmitted(true);
        answer.setSubmitTime(new Date());
        teamAssignmentAnswerDao.saveOrUpdate(answer);
        return true;
    }

    public List<TeamAssignmentAnswer> getTeamAnswerByAssignment(String id) {
        return teamAssignmentAnswerDao.getAnswerByAssignmentId(id);
    }

    public List<PersonalAssignmentAnswer> getPersonalAnswerByAssignment(String id) {
        return personalAssignmentAnswerDao.getAnswerByAssignmentId(id);
    }


    public TeamAssignmentAnswer getTeamAnswerByPK(TeamAssignmentAnswerPK pk) {
        return teamAssignmentAnswerDao.get(pk);
    }


    public PersonalAssignmentAnswer getPersonalAnswerByPK(PersonalAssignmentAnswerPK pk) {
        return personalAssignmentAnswerDao.get(pk);
    }
    public String teamLeaderSubmit(String sid,String cid,String assignment_id){
        String result = teamAssignmentAnswerDao.teamLeaderSubmit(sid,cid,assignment_id);
        return  result;
    }
}
