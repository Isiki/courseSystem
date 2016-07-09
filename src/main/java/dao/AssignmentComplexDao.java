package dao;

import java.util.List;
import java.util.Map;

/**
 * Created by Mouze on 2016/7/10.
 */
public interface AssignmentComplexDao {
    List<Map<String, Object>> assignmentsWithSubmitStatus(String course_id, String student_id);
}
