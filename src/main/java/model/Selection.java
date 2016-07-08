package model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;

/**
 * Created by Admin on 2016/7/4.
 */

@IdClass(SelectionPK.class)
public class Selection {
    private String studentId;
    private String courseId;


    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }


    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Selection selection = (Selection) o;

        if (studentId != null ? !studentId.equals(selection.studentId) : selection.studentId != null) return false;
        if (courseId != null ? !courseId.equals(selection.courseId) : selection.courseId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = studentId != null ? studentId.hashCode() : 0;
        result = 31 * result + (courseId != null ? courseId.hashCode() : 0);
        return result;
    }
}
