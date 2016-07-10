package dao;

import model.PersonalAssignmentAnswer;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public interface PersonalAssignmentAnswerDao extends Dao<PersonalAssignmentAnswer,String>{
    List<PersonalAssignmentAnswer> getAnswerByAssignmentId(String courseId);
    public PersonalAssignmentAnswer getPersonalAnswerByStudentId(String assgnment_id,String id);
    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByCourseId(String courseId);
}
