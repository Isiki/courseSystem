package model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Admin on 2016/7/4.
 */
@Entity
public class Assignment {
    private String id;
    private String courseId;
    private boolean isTeamwork;
    private int idInCourse;
    private String heading;
    private Date startTime;
    private Date endTime;
    private String description;
    private String attachmentUrl;
    private int totalGrade;
    @Id
    @Column(name = "id", nullable = false, length = 10)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @JoinTable
    @Column(name = "course_id", length = 10)
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    @Basic
    @Column(name = "is_teamwork", nullable = false, length = 1)
    public boolean getIsTeamwork() {
        return isTeamwork;
    }

    public void setIsTeamwork(boolean teamwork) {
        isTeamwork = teamwork;
    }

    @Basic
    @Column(name = "id_in_course", nullable = false, length = 11)
    public int getIdInCourse() {
        return idInCourse;
    }

    public void setIdInCourse(int idInCourse) {
        this.idInCourse = idInCourse;
    }

    @Basic
    @Column(name = "heading", length = 50)
    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }


    @Column(name = "start_time")
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    @Column(name = "end_time")
    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    @Basic
    @Column(name = "description",length = -1)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "attachment_url",length=50)
    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    @Basic
    @Column(name = "totalGrade",length = 11)
    public int getTotalGrade() {
        return totalGrade;
    }

    public void setTotalGrade(int totalGrade) {
        this.totalGrade = totalGrade;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Assignment that = (Assignment) o;

        if (isTeamwork != that.isTeamwork) return false;
        if (idInCourse != that.idInCourse) return false;
        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (courseId != null ? !courseId.equals(that.courseId) : that.courseId != null) return false;
        if (heading != null ? !heading.equals(that.heading) : that.heading != null) return false;
        if (startTime != null ? !startTime.equals(that.startTime) : that.startTime != null) return false;
        if (endTime != null ? !endTime.equals(that.endTime) : that.endTime != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (attachmentUrl != null ? !attachmentUrl.equals(that.attachmentUrl) : that.attachmentUrl != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (courseId != null ? courseId.hashCode() : 0);
        result = 31 * result + (isTeamwork ? 1 : 0);
        result = 31 * result + idInCourse;
        result = 31 * result + (heading != null ? heading.hashCode() : 0);
        result = 31 * result + (startTime != null ? startTime.hashCode() : 0);
        result = 31 * result + (endTime != null ? endTime.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (attachmentUrl != null ? attachmentUrl.hashCode() : 0);
        return result;
    }


}
