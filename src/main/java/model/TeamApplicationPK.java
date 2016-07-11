package model;

import java.io.Serializable;

/**
 * Created by andyz_000 on 2016/7/11.
 */
public class TeamApplicationPK implements Serializable{
    private String teamId;
    private  String studentId;

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeamApplicationPK that = (TeamApplicationPK) o;

        if (teamId != null ? !teamId.equals(that.teamId) : that.teamId != null) return false;
        if (studentId != null ? !studentId.equals(that.studentId) : that.studentId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = teamId != null ? teamId.hashCode() : 0;
        result = 31 * result + (studentId != null ? studentId.hashCode() : 0);
        return result;
    }
}
