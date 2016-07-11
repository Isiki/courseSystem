package daoImpl;

import dao.TeacherAssignmentDao;
import model.Assignment;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ElaineC on 2016/7/10.
 */
@Repository("TeacherAssignmentDao")
public class TeacherAssignmentDaoImpl implements TeacherAssignmentDao{
    @Autowired
    private SessionFactory sessionFactory;

    public List<PersonalAssignmentAnswer> getAllStudentSubmissions(String assignment_id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM personalassignmentanswer WHERE  assignment_id=\'"+assignment_id+"\'").addEntity(PersonalAssignmentAnswer.class);
        return query.list();
    }

    public List<TeamAssignmentAnswer> getAllTeamSubmissions(String assignment_id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM teamassignmentanswer WHERE assignment_id=\'"+assignment_id+"\'");
        return query.list();
    }

    @Override
    public List<Assignment> getAllAssignmentsOfTeacher(String teacher_id) {
        Query query = sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT assignment.* FROM assignment " +
                                "left join teaching on assignment.course_id = teaching.course_id " +
                                "where teaching.teacher_id = \'"+teacher_id+"\'").addEntity(Assignment.class);
        return query.list();
    }

    public List<Map<String,Object>> getAllStudentAssignmentSubmissions(String assignment_id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT student.id,student.real_name,personalassignmentanswer.submit_time FROM personalassignmentanswer INNER JOIN student ON student.id=personalassignmentanswer.student_id WHERE assignment_id=\'"+assignment_id+"\'");
        List<Object[]> personalResult = query.list();
        List<Map<String, Object>> targetList = new ArrayList<>();
        for(Object[] line : personalResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("submitter_id", line[0]);
            tmp.put("submitter_name", line[1]);
            tmp.put("submit_time", line[2]);
            targetList.add(tmp);
        }
        return targetList;
    }
    public List<Map<String,Object>> getAllTeamAssignmentSubmissions(String assignment_id){
        Query query=sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT team.id,team.team_name,teamassignmentanswer.submit_time FROM teamassignmentanswer INNER JOIN team ON team.id=teamassignmentanswer.team_id WHERE assignment_id=\'"+assignment_id+"\'");
        List<Object[]> personalResult = query.list();
        List<Map<String, Object>> targetList = new ArrayList<>();
        for(Object[] line : personalResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("submitter_id", line[0]);
            tmp.put("submitter_name", line[1]);
            tmp.put("submit_time", line[2]);
            targetList.add(tmp);
        }
        return targetList;

    }
}
