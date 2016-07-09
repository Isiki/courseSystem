package model;

import java.io.Serializable;

/**
 * Created by Admin on 2016/7/4.
 */
public class TeamAssignmentAnswerPK implements Serializable {
    private String teamId;
    private String assignmentId;

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(String assignmentId) {
        this.assignmentId = assignmentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeamAssignmentAnswerPK that = (TeamAssignmentAnswerPK) o;

        if (teamId != null ? !teamId.equals(that.teamId) : that.teamId != null) return false;
        if (assignmentId != null ? !assignmentId.equals(that.assignmentId) : that.assignmentId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = teamId != null ? teamId.hashCode() : 0;
        result = 31 * result + (assignmentId != null ? assignmentId.hashCode() : 0);
        return result;
    }
}
