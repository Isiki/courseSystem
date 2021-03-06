package dao;

import model.PersonalAssignmentAnswer;
import model.PersonalAssignmentAnswerPK;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public interface PersonalAssignmentAnswerDao extends Dao<PersonalAssignmentAnswer, PersonalAssignmentAnswerPK>{
    List<PersonalAssignmentAnswer> getAnswerByAssignmentId(String courseId);
    public List<PersonalAssignmentAnswer> getPersonalAnswersByStudentId(String assgnment_id, String id);
    public List<PersonalAssignmentAnswer> getPersonalAnswersByCourseId(String id);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentsToBeSubmittedByStudent(String studentId);
    public List<PersonalAssignmentAnswer> getPersonalAssignmentsToBeSubmittedByCourseId(String courseId);
    int UpdatePersonalGradeAndComment(String assid, String stuid, int grade, String comment);

}
