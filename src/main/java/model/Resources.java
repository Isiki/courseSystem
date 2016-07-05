package model;

import javax.persistence.*;
import java.util.Arrays;

/**
 * Created by isiki on 2016/7/4.
 */

public class Resources implements java.io.Serializable{
    private Long id;
    private String name;
    private String description;
    private String type;
    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] content;
    private Course course;

    public Resources(){

    }

    public Resources(Long id,String name,String description,String type,byte[] content,Course course){
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.content = content;
        this.course = course;
    }




    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public Course getCourse(){return course;}

    public void setCourse(Course course){this.course=course;}



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Resources resources = (Resources) o;

        if (id != null ? !id.equals(resources.id) : resources.id != null) return false;
        if (name != null ? !name.equals(resources.name) : resources.name != null) return false;
        if (description != null ? !description.equals(resources.description) : resources.description != null)
            return false;
        if (type != null ? !type.equals(resources.type) : resources.type != null) return false;
        if (!Arrays.equals(content, resources.content)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(content);
        return result;
    }
}
