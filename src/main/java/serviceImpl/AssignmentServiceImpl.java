package serviceImpl;

import dao.AssignmentDao;
import dao.PersonalAssignmentAnswerDao;
import dao.TeamAssignmentAnswerDao;
import entity.BaseException;
import entity.ERROR;
import model.Assignment;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.AssignmentService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by isiki on 2016/7/4.
 */
@Service
public class AssignmentServiceImpl implements AssignmentService {
    @Autowired
    AssignmentDao assignmentDao;

    @Autowired
    PersonalAssignmentAnswerDao PassignmentAnswerDao;

    @Autowired
    TeamAssignmentAnswerDao TassignmentAnswerDao;



    @Override
    public int getAssignmentTeamType(String assignment_id) {
        Assignment as = assignmentDao.get(assignment_id);
        return as.getIsTeamwork()?1:0;
    }


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
    public int consultAssignmentMaxId(String coursId) {
        return assignmentDao.countByCourseId(coursId);
    }

    @Override
    public Assignment updateAssignment(Assignment assignment) {
        assignmentDao.saveOrUpdate(assignment);
        return assignment;
    }

    @Override
    public void removeAssignment(String id) {
        assignmentDao.deleteByKey(id);
    }
}
