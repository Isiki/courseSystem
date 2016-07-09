package serviceImpl;

import dao.AssignmentAnswerDao;
import dao.AssignmentDao;
import dao.PersonalAssignmentAnswerDao;
import dao.TeamAssignmentAnswerDao;
import model.Assignment;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.AssignmentAnswerService;
import service.AssignmentService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
@Service
public class AssignmentAnswerServiceImpl implements AssignmentAnswerService{
    @Autowired
    private AssignmentAnswerDao assignmentAnswerDao;
    @Autowired
    private PersonalAssignmentAnswerDao personalAssignmentAnswerDao;
    @Autowired
    private TeamAssignmentAnswerDao teamAssignmentAnswerDao;
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

