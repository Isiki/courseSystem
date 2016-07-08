package serviceImpl;

import dao.AdminDao;
import dao.StudentDao;
import dao.TeacherDao;
import model.Admin;
import model.Student;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.LoginService;

/**
 * Created by Mouze on 2016/7/6.
 */
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    StudentDao sdao;
    @Autowired
    TeacherDao tdao;
    @Autowired
    AdminDao adao;

    public Admin LoginAsAdmin(String id, String password) {
        Admin ad = adao.get(id);
        if (null!=ad&&ad.getPassword().equals(password)) {
            return ad;
        }else
        {
            return null;
        }
    }

    public Student LoginAsStudent(String id, String password) {
        Student st = sdao.getStudentById(id);
        if(null!=st&&st.getPassword().equals(password)) {
            return st;
        }else
        {
            return null;
        }
    }

    public Teacher LoginAsTeacher(String id, String password) {
        Teacher tc = tdao.get(id);
        if(null!=tc&&tc.getPassword().equals(password)) {
            return tc;
        }else{
            return null;
        }
    }
}
