package dao;

import model.PersonalAssignmentAnswer;
import model.PersonalAssignmentAnswerPK;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public interface PersonalAssignmentAnswerDao extends Dao<PersonalAssignmentAnswer, PersonalAssignmentAnswerPK>{
    List<PersonalAssignmentAnswer> getAnswerByAssignmentId(String courseId);
    public List<PersonalAssignmentAnswer> getPersonalAnswerByStudentId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAnswerByCourseId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByStudent(String studentId);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentToBeSubmittedByCourseId(String courseId);
}
