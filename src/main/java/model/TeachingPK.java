package model;

import java.io.Serializable;

/**
 * Created by Admin on 2016/7/4.
 */
public class TeachingPK implements Serializable {
    private String teacherId;
    private String courseId;

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
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

        TeachingPK that = (TeachingPK) o;

        if (teacherId != null ? !teacherId.equals(that.teacherId) : that.teacherId != null) return false;
        if (courseId != null ? !courseId.equals(that.courseId) : that.courseId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = teacherId != null ? teacherId.hashCode() : 0;
        result = 31 * result + (courseId != null ? courseId.hashCode() : 0);
        return result;
    }
}
