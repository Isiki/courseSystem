package model;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * Created by Admin on 2016/7/4.
 */
public class PersonalAssignmentAnswerPK implements Serializable {
    private String studentId;
    private String assignmentId;

    @Column(name = "student_id", nullable = false, length = 50)
    @Id
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    @Column(name = "assignment_id", nullable = false, length = 50)
    @Id
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

        PersonalAssignmentAnswerPK that = (PersonalAssignmentAnswerPK) o;

        if (studentId != null ? !studentId.equals(that.studentId) : that.studentId != null) return false;
        if (assignmentId != null ? !assignmentId.equals(that.assignmentId) : that.assignmentId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = studentId != null ? studentId.hashCode() : 0;
        result = 31 * result + (assignmentId != null ? assignmentId.hashCode() : 0);
        return result;
    }
}
