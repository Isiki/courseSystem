package service;

import entity.BaseException;
import model.Assignment;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by isiki on 2016/7/4.
 */
public interface AssignmentService {
    void insertAssignment(Assignment assignment);
    int consultAssignmentMaxId(String coursId);
    Assignment getAssignmentById(String id);
    ArrayList<Assignment> getAllByCourseId(String id);
    Assignment updateAssignment(Assignment assignment);
    void removeAssignment(String id);
}
