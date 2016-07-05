package serviceImpl;

import dao.AssignmentDao;
import entity.BaseException;
import entity.ERROR;
import model.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.AssignmentService;

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

    @Override
    public int consultAssignmentNumber(String coursId) {
        return assignmentDao.countByCourseId(coursId);
    }
}
