package dao;
import model.Assignment;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by isiki on 2016/7/4.
 */
public interface AssignmentDao extends Dao<Assignment,String>{
    Assignment getAssignmentById(String id);
    void insertAssignment(Assignment assignment);
    int countByCourseId(String courseId);
    ArrayList<Assignment> getAllByCourseId(String id);
    public List<Map<String, Object>> allAssignmentsWithSubmissionStatusMP(String course_id, String student_id);
    public List<Map<String,Object>> allAssimentsWithCourseAndSubmission(String student_id);
}
