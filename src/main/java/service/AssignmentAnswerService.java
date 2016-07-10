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
    List<PersonalAssignmentAnswer> getPersonalAnswerByStudentId(String id);
    List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id);
    List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id);
    List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id);
    List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId);
    List<PersonalAssignmentAnswer> getPersonalAssignmenToBeSubmittedByCourse(String course);
    List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByTeam(String teamId);
    List<TeamAssignmentAnswer> getTeamAssignmentNotSubmittedByCourse(String courseId);
    void commentAssignment(PersonalAssignmentAnswer assignmentAnswer);
    void commentAssignment(TeamAssignmentAnswer assignmentAnswer);
    boolean insertPAnswer(PersonalAssignmentAnswer answer);
    boolean insertTAnswer(TeamAssignmentAnswer answer);
    List<TeamAssignmentAnswer> getTeamAnswerByAssignment(String id);
    List<PersonalAssignmentAnswer> getPersonalAnswerByAssignment(String id);
    TeamAssignmentAnswer getTeamAnswerByPK(TeamAssignmentAnswerPK pk);
    PersonalAssignmentAnswer getPersonalAnswerByPK(PersonalAssignmentAnswerPK pk);
}
