package serviceImpl;

import dao.AssignmentAnswerDao;
import dao.AssignmentDao;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
@Service
public class AssignmentAnswerServiceImpl {
    @Autowired
    private AssignmentAnswerDao assignmentAnswerDao;
    public List<PersonalAssignmentAnswer> getPersonalAnswerByStudentId(String id){
        return assignmentAnswerDao.getPersonalAnswerByStudentId(id);
    }
    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id){
        return assignmentAnswerDao.getPersonalAnswerByCourseId(id);
    }
    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id){
        return assignmentAnswerDao.getTeamAnswerByTeamId(id);
    }
    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id){
        return  assignmentAnswerDao.getTeamAnswerByCourseId(id);
    }
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId){
        return assignmentAnswerDao.getPersonalAssignmentToBeSubmittedByStudent(studentId);
    }
    public List<PersonalAssignmentAnswer> getPersonalAssignmenToBeSubmittedByCourse(String course){
        return assignmentAnswerDao.getPersonalAssignmenToBeSubmittedByCourse(course);
    }
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByTeam(String teamId){
        return assignmentAnswerDao.getTeamAssignmentNotSubmittedByTeam(teamId);
    }
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByCourse(String courseId){
        return  assignmentAnswerDao.getTeamAssignmentNotSubmittedByCourse(courseId);
    }
}
