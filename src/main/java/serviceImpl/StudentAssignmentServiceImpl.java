package serviceImpl;

import dao.AssignmentDao;
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

    @Override
    public int getAssignmentTeamType(String assignment_id) {
        Assignment as = assignmentDao.get(assignment_id);
        return as.getIsTeamwork()?1:0;
    }

    @Override
    public List<Map<String, Object>> getAllAssignmentsWithSubmissionStatusMP(String course_id, String student_id) {
        return null;
    }

    @Override
    public PersonalAssignmentAnswer getMySubmission(String assignment_id, String student_id) {
        return null;
    }

    @Override
    public TeamAssignmentAnswer getTeamSubmission(String assignment_id, String student_id) {
        return null;
    }
}
