package service;

import model.PersonalAssignmentAnswer;
import model.Student;
import model.Team;
import model.TeamAssignmentAnswer;

import java.util.List;
import java.util.Map;

/**
 * Created by Mouze on 2016/7/10.
 */
public interface StudentAssignmentService {
    int                         getAssignmentTeamType(String assignment_id);
    List<Map<String, Object>>   getAllAssignmentsWithSubmissionStatusMP(String course_id, String student_id);
    PersonalAssignmentAnswer    getMySubmission(String assignment_id, String student_id);
    TeamAssignmentAnswer        getTeamSubmission(String assignment_id, String student_id);
}
