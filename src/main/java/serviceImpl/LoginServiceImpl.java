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

    public boolean LoginAsAdmin(String id, String password) {
        Admin ad = adao.get(id);
        return (ad.getPassword().equals(password));
    }

    public boolean LoginAsStudent(String id, String password) {
        Student st = sdao.getStudentById(id);
        return (st.getPassword().equals(password));
    }

    public boolean LoginAsTeacher(String id, String password) {
        Teacher tc = tdao.get(id);
        return (tc.getPassword().equals(password));
    }
}
