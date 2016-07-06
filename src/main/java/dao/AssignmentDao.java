package dao;
import model.Assignment;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/4.
 */
public interface AssignmentDao {
    Assignment getAssignmentById(String id);
    void insertAssignment(Assignment assignment);
    ArrayList<Assignment> getAllByCourseId(String id);
}
