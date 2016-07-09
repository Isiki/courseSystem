package dao;
import model.PersonalAssignmentAnswer;
import model.Student;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/3.
 */
public interface StudentDao {
    Student getStudentById(String id);

    ArrayList<PersonalAssignmentAnswer> getAnswer(String aid, String sid);
}
