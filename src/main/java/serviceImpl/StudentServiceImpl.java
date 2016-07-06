package serviceImpl;

import dao.SelectionDao;
import dao.StudentDao;
import model.Course;
import model.Selection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.StudentService;
import model.Student;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/3.
 */
@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentDao studentDao;

    @Autowired
    private SelectionDao selectionDao;

    public Student getStudentById(String id) {
        return studentDao.getStudentById(id);
    }

    public ArrayList<String> getAllCourseById(String id) {
        ArrayList<String> courseid = selectionDao.getCourseIdByStudentId(id);
        ArrayList<Course> course = new ArrayList<Course>();
        //// TODO: 2016/7/5 Need getCourseById
        return courseid;
    }
}
