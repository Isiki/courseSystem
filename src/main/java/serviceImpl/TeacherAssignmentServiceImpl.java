package serviceImpl;

import dao.TeacherAssignmentDao;
import model.PersonalAssignmentAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.TeacherAssignmentService;

import java.util.List;

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
}
