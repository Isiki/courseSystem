package model;

/**
 * Created by Admin on 2016/7/4.
 */

public class Course {
    private String id;
    private String courseName;
    private boolean teamAllowed;
    private String teamMinNumber;
    private String teamMaxNumber;
    private String description;

    public void setDescription(String description){this.description =  description;}

    public String getDescription(){return description;}

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

    public String getTeamMinNumber() {
        return teamMinNumber;
    }

    public void setTeamMinNumber(String teamMinMember) {
        this.teamMinNumber = teamMinNumber;
    }

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
        if (teamMinNumber != null ? !teamMinNumber.equals(course.teamMinNumber) : course.teamMinNumber != null)
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
        result = 31 * result + (teamMinNumber != null ? teamMinNumber.hashCode() : 0);
        result = 31 * result + (teamMaxNumber != null ? teamMaxNumber.hashCode() : 0);
        return result;
    }
}
