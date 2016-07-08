package model;

import java.io.Serializable;

/**
 * Created by Admin on 2016/7/4.
 */
public class TeamingPK implements Serializable {
    private String studentId;
    private String teamId;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeamingPK teamingPK = (TeamingPK) o;

        if (studentId != null ? !studentId.equals(teamingPK.studentId) : teamingPK.studentId != null) return false;
        if (teamId != null ? !teamId.equals(teamingPK.teamId) : teamingPK.teamId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = studentId != null ? studentId.hashCode() : 0;
        result = 31 * result + (teamId != null ? teamId.hashCode() : 0);
        return result;
    }
}
