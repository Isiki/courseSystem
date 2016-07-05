package model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;

/**
 * Created by Admin on 2016/7/4.
 */
@Entity
@IdClass(TeachingPK.class)
public class Teaching {
    private String teacherId;
    private String courseId;

    @Id
    @Column(name = "teacher_id", nullable = false, length = 10)
    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    @Id
    @Column(name = "course_id", nullable = false, length = 10)
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

        Teaching teaching = (Teaching) o;

        if (teacherId != null ? !teacherId.equals(teaching.teacherId) : teaching.teacherId != null) return false;
        if (courseId != null ? !courseId.equals(teaching.courseId) : teaching.courseId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = teacherId != null ? teacherId.hashCode() : 0;
        result = 31 * result + (courseId != null ? courseId.hashCode() : 0);
        return result;
    }
}
