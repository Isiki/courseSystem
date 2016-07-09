package dao;
import model.PersonalAssignmentAnswer;
import model.Student;
import java.util.ArrayList;
import java.util.List;
/**
 * Created by isiki on 2016/7/3.
 */
public interface StudentDao {

    ArrayList<PersonalAssignmentAnswer> getAnswer(String aid, String sid);
    List<Student> getAllStudents();
    Student getStudentById(String id);
    Student getStudentByName(String name);

}
