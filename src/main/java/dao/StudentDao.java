package dao;
import model.Student;

import java.util.List;

/**
 * Created by isiki on 2016/7/3.
 */
public interface StudentDao {
    public List<Student> getAllStudents();
    public Student getStudentById(String id);
    public Student getStudentByName(String name);
}
