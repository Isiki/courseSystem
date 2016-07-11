package serviceImpl;

import dao.TeacherAssignmentDao;
import model.Assignment;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.TeacherAssignmentService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by ElaineC on 2016/7/10.
 */

@Service
public class TeacherAssignmentServiceImpl implements TeacherAssignmentService {
    @Autowired
    private TeacherAssignmentDao teacherAssignmentDao;
    public List<PersonalAssignmentAnswer> getAllPersonalSubmissions(String assignment_id){
        List<PersonalAssignmentAnswer> list=teacherAssignmentDao.getAllStudentSubmissions(assignment_id);
        return list;
    }
    public List<TeamAssignmentAnswer> getAllTeamSubmissions(String assignment_id){
        List<TeamAssignmentAnswer> list=teacherAssignmentDao.getAllTeamSubmissions(assignment_id);
        return list;
    }

    @Override
    public List<Assignment> getAllAssignmentsOfTeacher(String teacher_id) {
        return teacherAssignmentDao.getAllAssignmentsOfTeacher(teacher_id);
    }

    public List<Map<String,Object>> getAllAssignmentSubmissions(String assignment_id, boolean is_team){
        List<Map<String,Object>> list=new ArrayList<>();
        if(is_team)
        {
            list=teacherAssignmentDao.getAllTeamAssignmentSubmissions(assignment_id);
        }
        else
        {
            list=teacherAssignmentDao.getAllStudentAssignmentSubmissions(assignment_id);
        }
        return list;
    }
}
