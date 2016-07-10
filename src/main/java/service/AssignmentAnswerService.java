package service;

import model.PersonalAssignmentAnswer;
import model.PersonalAssignmentAnswerPK;
import model.TeamAssignmentAnswer;
import model.TeamAssignmentAnswerPK;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
public interface AssignmentAnswerService {
    public List<PersonalAssignmentAnswer> getPersonalAnswerByStudentId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id);
    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id);
    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId);
    public List<PersonalAssignmentAnswer> getPersonalAssignmenToBeSubmittedByCourse(String course);
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByTeam(String teamId);
    public List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByCourse(String courseId);
    void commentAssignment(PersonalAssignmentAnswer assignmentAnswer);
    void commentAssignment(TeamAssignmentAnswer assignmentAnswer);
    List<TeamAssignmentAnswer> getTeamAnswerByAssignment(String id);
    List<PersonalAssignmentAnswer> getPersonalAnswerByAssignment(String id);
    TeamAssignmentAnswer getTeamAnswerByPK(TeamAssignmentAnswerPK pk);
    PersonalAssignmentAnswer getPersonalAnswerByPK(PersonalAssignmentAnswerPK pk);
}
