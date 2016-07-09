package dao;

import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
public interface AssignmentAnswerDao {
    public List<PersonalAssignmentAnswer> getPersonalAnswerByStudentId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id);
    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id);
    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByCourseId(String courseId);
    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByTeam(String teamId);
    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByCourseId(String courseId);


}
