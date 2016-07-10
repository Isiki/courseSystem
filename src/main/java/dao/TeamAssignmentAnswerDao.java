package dao;

import model.TeamAssignmentAnswer;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public interface TeamAssignmentAnswerDao extends Dao<TeamAssignmentAnswer,String> {
    List<TeamAssignmentAnswer> getAnswerByAssignmentId(String assignmentId);
    public List<TeamAssignmentAnswer> getTeamAnswerByTeamId(String id);
    public List<TeamAssignmentAnswer> getTeamAnswerByCourseId(String id);

    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByTeam(String teamId);
    public List<TeamAssignmentAnswer> getTeamAssignmentToBeSubmittedByCourseId(String courseId);

}
