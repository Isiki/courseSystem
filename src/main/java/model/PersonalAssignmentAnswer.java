package model;

import java.util.Date;

/**
 * Created by Admin on 2016/7/4.
 */
public class PersonalAssignmentAnswer {
    private String studentId;
    private String assignmentId;
    private boolean isSubmitted;
    private Date submitTime;
    private String text;
    private String attachmentUrl;
    private int grade;
    private String comment;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(String assignmentId) {
        this.assignmentId = assignmentId;
    }

    public boolean getIsSubmitted() {
        return isSubmitted;
    }

    public void setIsSubmitted(boolean submitted) {
        isSubmitted = submitted;
    }

    public Date getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(Date submitTime) {
        this.submitTime = submitTime;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public int getGrade(){return grade;}

    public void setGrade(int grade){this.grade=grade;}

    public String getComment(){return comment;}

    public void setComment(String comment){this.comment=comment;}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PersonalAssignmentAnswer that = (PersonalAssignmentAnswer) o;

        if (studentId != null ? !studentId.equals(that.studentId) : that.studentId != null) return false;
        if (assignmentId != null ? !assignmentId.equals(that.assignmentId) : that.assignmentId != null) return false;
        if (submitTime != null ? !submitTime.equals(that.submitTime) : that.submitTime != null) return false;
        if (text != null ? !text.equals(that.text) : that.text != null) return false;
        if (attachmentUrl != null ? !attachmentUrl.equals(that.attachmentUrl) : that.attachmentUrl != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = studentId != null ? studentId.hashCode() : 0;
        result = 31 * result + (assignmentId != null ? assignmentId.hashCode() : 0);
        result = 31 * result + (submitTime != null ? submitTime.hashCode() : 0);
        result = 31 * result + (text != null ? text.hashCode() : 0);
        result = 31 * result + (attachmentUrl != null ? attachmentUrl.hashCode() : 0);
        return result;
    }
}
