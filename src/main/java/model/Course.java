package model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Admin on 2016/7/4.
 */
@Entity
@Table
public class Course {
    private String id;
    private String courseName;
    private boolean teamAllowed;
    private String teamMinMember;
    private String teamMaxNumber;
    private Set resources = new HashSet(0);


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }


    public boolean isTeamAllowed() {
        return teamAllowed;
    }

    public void setTeamAllowed(boolean teamAllowed) {
        this.teamAllowed = teamAllowed;
    }


    public String getTeamMinMember() {
        return teamMinMember;
    }

    public void setTeamMinMember(String teamMinMember) {
        this.teamMinMember = teamMinMember;
    }


    public String getTeamMaxNumber() {
        return teamMaxNumber;
    }

    public void setTeamMaxNumber(String teamMaxNumber) {
        this.teamMaxNumber = teamMaxNumber;
    }

    public void setResources(Set resources){this.resources = resources;}
    public Set getResources(){return this.resources;}


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
