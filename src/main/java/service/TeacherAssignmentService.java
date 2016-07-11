package service;

import model.Assignment;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;

import java.util.List;
import java.util.Map;

/**
 * Created by ElaineC on 2016/7/10.
 */
public interface TeacherAssignmentService {
    public List<PersonalAssignmentAnswer> getAllPersonalSubmissions(String assignment_id);
    public List<TeamAssignmentAnswer> getAllTeamSubmissions(String assignment_id);
    List<Assignment> getAllAssignmentsOfTeacher(String teacher_id);
    List<Map<String,Object>> getAllAssignmentSubmissions(String assignment_id, boolean is_team);
}
