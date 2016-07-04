package serviceImpl;

import dao.AssignmentDao;
import entity.BaseException;
import entity.ERROR;
import model.Assignment;
import service.AssignmentService;

/**
 * Created by isiki on 2016/7/4.
 */
public class AssignmentServiceImpl implements AssignmentService {
    public void insertAssignment(Assignment assignment) throws BaseException {
        checkAssignmentExists(assignment.getId());
        AssignmentDao.insertAssignment(assignment);
    }

    public void checkAssignmentExists(String assignmentId) throws BaseException {
        Assignment assignment = AssignmentDao.getAssignmentById(assignmentId);
        if (assignment != null) {
            throw new BaseException(ERROR.ASSIGNMENT_NUMBER_EXIST, ERROR.hashMap.get(ERROR.ASSIGNMENT_NUMBER_EXIST));
        }
    }
}
