package service;

import model.PersonalAssignmentAnswer;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/10.
 */
public interface TeacherAssignmentService {
    public List<PersonalAssignmentAnswer> getAllPersonalSubmissions(String assignment_id);
}
