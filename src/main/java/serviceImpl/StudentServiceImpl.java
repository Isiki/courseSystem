package serviceImpl;

import dao.StudentDao;
import model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.StudentService;

/**
 * Created by isiki on 2016/7/3.
 */
@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentDao studentDao;
    public Student getStudentById(String id) {
        return studentDao.getStudentById(id);
    }
}