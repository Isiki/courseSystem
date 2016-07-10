package serviceImpl;

import dao.AssignmentDao;
import dao.PersonalAssignmentAnswerDao;
import dao.TeamAssignmentAnswerDao;
import model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.StudentAssignmentService;

import java.util.List;
import java.util.Map;

/**
 * Created by Mouze on 2016/7/10.
 */
@Service
public class StudentAssignmentServiceImpl implements StudentAssignmentService{

    @Autowired
    private AssignmentDao assignmentDao;
    @Autowired
    private PersonalAssignmentAnswerDao personalAssignmentAnswerDao;
    @Autowired
    private TeamAssignmentAnswerDao teamAssignmentAnswerDao;

    @Override
    public int getAssignmentTeamType(String assignment_id) {
        Assignment as = assignmentDao.get(assignment_id);
        return as.getIsTeamwork()?1:0;
    }

    @Override
    public List<Map<String, Object>> getAllAssignmentsWithSubmissionStatusMP(String course_id, String student_id) {
        List<Map<String,Object>> list=assignmentDao.allAssignmentsWithSubmissionStatusMP(course_id,student_id);
        return list;
    }

    @Override
    public PersonalAssignmentAnswer getMySubmission(String assignment_id, String student_id) {
        PersonalAssignmentAnswer paa=personalAssignmentAnswerDao.getPersonalAnswerByStudentId(assignment_id,student_id);
        return paa;
    }

    @Override
    public TeamAssignmentAnswer getTeamSubmission(String assignment_id, String student_id) {
        TeamAssignmentAnswer taa=teamAssignmentAnswerDao.getTeamAnswerByStudentId(assignment_id,student_id);
        return taa;
    }
    public List<Map<String,Object>>    getAssignmentsWithCourseAndSubmission(String student_id){
        List<Map<String,Object>> list=assignmentDao.allAssimentsWithCourseAndSubmission(student_id);
        return list;
    }
}
