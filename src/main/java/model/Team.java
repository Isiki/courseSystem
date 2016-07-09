package model;

/**
 * Created by Admin on 2016/7/4.
 */
public class Team {
    private String id;
    private String courseId;
    private String teamName;
    private String teamDescription;
    private boolean isFull;
    private String teamleaderId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamDescription() {
        return teamDescription;
    }

    public void setTeamDescription(String teamDescription) {
        this.teamDescription = teamDescription;
    }

    public boolean getIsFull() {
        return isFull;
    }

    public void setIsFull(boolean full) {
        isFull = full;
    }

    public String getTeamleaderId() {
        return teamleaderId;
    }

    public void setTeamleaderId(String teamleaderId) {
        this.teamleaderId = teamleaderId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Team team = (Team) o;

        if (isFull != team.isFull) return false;
        if (id != null ? !id.equals(team.id) : team.id != null) return false;
        if (courseId != null ? !courseId.equals(team.courseId) : team.courseId != null) return false;
        if (teamName != null ? !teamName.equals(team.teamName) : team.teamName != null) return false;
        if (teamDescription != null ? !teamDescription.equals(team.teamDescription) : team.teamDescription != null)
            return false;
        if (teamleaderId != null ? !teamleaderId.equals(team.teamleaderId) : team.teamleaderId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (courseId != null ? courseId.hashCode() : 0);
        result = 31 * result + (teamName != null ? teamName.hashCode() : 0);
        result = 31 * result + (teamDescription != null ? teamDescription.hashCode() : 0);
        result = 31 * result + (isFull ? 1 : 0);
        result = 31 * result + (teamleaderId != null ? teamleaderId.hashCode() : 0);
        return result;
    }
}
