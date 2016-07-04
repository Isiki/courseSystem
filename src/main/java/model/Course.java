package model;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * Created by Admin on 2016/7/4.
 */
@Entity
public class Course {
    private String id;
    private String courseName;
    private boolean teamAllowed;
    private String teamMinMember;
    private String teamMaxNumber;

    @Id
    @Column(name = "id", nullable = false, length = 10)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Basic
    @Column(name = "course_name", nullable = false, length = 50)
    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    @Basic
    @Column(name = "team_allowed", nullable = false)
    public boolean isTeamAllowed() {
        return teamAllowed;
    }

    public void setTeamAllowed(boolean teamAllowed) {
        this.teamAllowed = teamAllowed;
    }

    @Basic
    @Column(name = "team_min_member", nullable = false, length = 50)
    public String getTeamMinMember() {
        return teamMinMember;
    }

    public void setTeamMinMember(String teamMinMember) {
        this.teamMinMember = teamMinMember;
    }

    @Basic
    @Column(name = "team_max_number", nullable = false, length = 50)
    public String getTeamMaxNumber() {
        return teamMaxNumber;
    }

    public void setTeamMaxNumber(String teamMaxNumber) {
        this.teamMaxNumber = teamMaxNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Course course = (Course) o;

        if (teamAllowed != course.teamAllowed) return false;
        if (id != null ? !id.equals(course.id) : course.id != null) return false;
        if (courseName != null ? !courseName.equals(course.courseName) : course.courseName != null) return false;
        if (teamMinMember != null ? !teamMinMember.equals(course.teamMinMember) : course.teamMinMember != null)
            return false;
        if (teamMaxNumber != null ? !teamMaxNumber.equals(course.teamMaxNumber) : course.teamMaxNumber != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (courseName != null ? courseName.hashCode() : 0);
        result = 31 * result + (teamAllowed ? 1 : 0);
        result = 31 * result + (teamMinMember != null ? teamMinMember.hashCode() : 0);
        result = 31 * result + (teamMaxNumber != null ? teamMaxNumber.hashCode() : 0);
        return result;
    }
}
