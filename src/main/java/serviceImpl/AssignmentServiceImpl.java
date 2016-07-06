package serviceImpl;

import dao.AssignmentDao;
import entity.BaseException;
import entity.ERROR;
import model.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.AssignmentService;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/4.
 */
@Service
public class AssignmentServiceImpl implements AssignmentService {
    @Autowired
    AssignmentDao assignmentDao;

    @Override
    public void insertAssignment(Assignment assignment) {
        assignmentDao.save(assignment);
    }


    public Assignment getAssignmentById(String id) {
        return assignmentDao.getAssignmentById(id);
    }

    public ArrayList<Assignment> getAllByCourseId(String id) {
        return assignmentDao.getAllByCourseId(id);
    }

    public void checkAssignmentExists(String assignmentId) throws BaseException {
        Assignment assignment = assignmentDao.getAssignmentById(assignmentId);
        if (assignment != null) {
            throw new BaseException(ERROR.ASSIGNMENT_NUMBER_EXIST, ERROR.hashMap.get(ERROR.ASSIGNMENT_NUMBER_EXIST));
        }
    }
    @Override
    public int consultAssignmentNumber(String coursId) {
        return assignmentDao.countByCourseId(coursId);
    }
}
