package dao;

import model.Selection;
import model.SelectionPK;

import java.util.ArrayList;

/**
 * Created by Admin on 2016/7/5.
 */
public interface SelectionDao {
    ArrayList<String> getCourseIdByStudentId(String student_id);
}
