package dao;
import model.Assignment;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/4.
 */
public interface AssignmentDao extends Dao<Assignment,String>{
    Assignment getAssignmentById(String id);
    void insertAssignment(Assignment assignment);
    int countByCourseId(String courseId);
    ArrayList<Assignment> getAllByCourseId(String id);
}
