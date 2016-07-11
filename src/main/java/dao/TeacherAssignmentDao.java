package dao;

import model.Assignment;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;

import java.util.List;
import java.util.Map;

/**
 * Created by ElaineC on 2016/7/10.
 */
public interface TeacherAssignmentDao {
    public List<PersonalAssignmentAnswer>  getAllStudentSubmissions(String assignment_id);
    public List<TeamAssignmentAnswer> getAllTeamSubmissions(String assignment_id);
    List<Assignment> getAllAssignmentsOfTeacher(String teacher_id);
    List<Map<String,Object>> getAllStudentAssignmentSubmissions(String assignment_id);
    List<Map<String,Object>> getAllTeamAssignmentSubmissions(String assignment_id);
}
