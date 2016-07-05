package service;

import entity.BaseException;
import model.Assignment;

/**
 * Created by isiki on 2016/7/4.
 */
public interface AssignmentService {
    void insertAssignment(Assignment assignment) throws BaseException;
}
