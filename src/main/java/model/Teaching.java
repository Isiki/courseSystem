package model;

/**
 * Created by Admin on 2016/7/4.
 */

public class Teaching {
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
