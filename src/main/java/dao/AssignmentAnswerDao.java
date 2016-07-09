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
    public List<PersonalAssignmentAnswer> getPersonalAssignmenToBeSubmittedByCourse(String course);
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByTeam(String teamId);
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByCourse(String courseId);


}
