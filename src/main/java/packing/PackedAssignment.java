package packing;

import model.Assignment;

/**
 * Created by ElaineC on 2016/7/9.
 */
public class PackedAssignment {
    Assignment assignment;

    public String getIsSubmitted() {
        return isSubmitted;
    }

    public void setIsSubmitted(String isSubmitted) {
        this.isSubmitted = isSubmitted;
    }

    public void setIsSubmitted(int isSubmitted){
        this.isSubmitted = (isSubmitted != 0)?"true":"false";
    }

    private String isSubmitted;

}
