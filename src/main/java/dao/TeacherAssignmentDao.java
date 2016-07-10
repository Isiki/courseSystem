package dao;

import model.PersonalAssignmentAnswer;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/10.
 */
public interface TeacherAssignmentDao {
    public List<PersonalAssignmentAnswer>  getAllStudentSubmissions(String assignment_id);
}
