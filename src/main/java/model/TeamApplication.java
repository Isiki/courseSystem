package model;

import javax.persistence.*;

/**
 * Created by andyz_000 on 2016/7/10.
 */
@Entity
public class TeamApplication {
    private TeamApplicationPK teamApplicationPK;
    private String courseId;
    private String description;
    private String realName;

    public TeamApplicationPK getTeamApplicationPK() {
        return teamApplicationPK;
    }

    public void setTeamApplicationPK(TeamApplicationPK teamApplicationPK) {
        this.teamApplicationPK = teamApplicationPK;
    }


    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }




    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeamApplication that = (TeamApplication) o;



        if (courseId != null ? !courseId.equals(that.courseId) : that.courseId != null) return false;
        if (teamApplicationPK != null ? !teamApplicationPK.equals(that.teamApplicationPK) : that.teamApplicationPK != null) return false;
        if (realName != null ? !realName.equals(that.realName) : that.realName != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;


        return true;
    }

    @Override
    public int hashCode() {
        int result = teamApplicationPK != null ? teamApplicationPK.hashCode() : 0;
        result = 31 * result + (courseId != null ? courseId.hashCode() : 0);
        result = 31 * result + (realName != null ? realName.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }
}
