package model;

/**
 * Created by Admin on 2016/7/4.
 */
public class Teaming {
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

        Teaming teaming = (Teaming) o;

        if (studentId != null ? !studentId.equals(teaming.studentId) : teaming.studentId != null) return false;
        if (teamId != null ? !teamId.equals(teaming.teamId) : teaming.teamId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = studentId != null ? studentId.hashCode() : 0;
        result = 31 * result + (teamId != null ? teamId.hashCode() : 0);
        return result;
    }
}
