package dao;

import model.TeamAssignmentAnswer;
import model.TeamAssignmentAnswerPK;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public interface TeamAssignmentAnswerDao extends Dao<TeamAssignmentAnswer, TeamAssignmentAnswerPK> {
    List<TeamAssignmentAnswer> getAnswerByAssignmentId(String assignmentId);
    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id);
    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id);

    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByTeam(String teamId);
    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByCourseId(String courseId);
    public List<TeamAssignmentAnswer> getTeamAnswersByStudentId(String assignment_id,String student_id);
    public String teamLeaderSubmit(String sid,String cid,String assignment_id);

    int UpdateTeamGradeAndComment(String assid, String tmid, int grade, String comment);
}
