package serviceImpl;

import dao.AssignmentDao;
import entity.BaseException;
import entity.ERROR;
import model.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import service.AssignmentService;

/**
 * Created by isiki on 2016/7/4.
 */
public class AssignmentServiceImpl implements AssignmentService {
    @Autowired
    AssignmentDao assignmentDao;

    public void insertAssignment(Assignment assignment) throws BaseException {
        checkAssignmentExists(assignment.getId());
        assignmentDao.insertAssignment(assignment);
    }

    public void checkAssignmentExists(String assignmentId) throws BaseException {
        Assignment assignment = assignmentDao.getAssignmentById(assignmentId);
        if (assignment != null) {
            throw new BaseException(ERROR.ASSIGNMENT_NUMBER_EXIST, ERROR.hashMap.get(ERROR.ASSIGNMENT_NUMBER_EXIST));
        }
    }
}
