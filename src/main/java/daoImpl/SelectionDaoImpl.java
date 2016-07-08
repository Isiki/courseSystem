package daoImpl;

import dao.SelectionDao;
import model.Course;
import model.Selection;
import model.SelectionPK;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

/**
 * Created by Admin on 2016/7/5.
 */
@Repository("SelectionDao")
public class SelectionDaoImpl extends DaoImpl<Selection, SelectionPK> implements SelectionDao {

    @Autowired
    private SessionFactory sessionFactory;

    public ArrayList<String> getCourseIdByStudentId(String student_id) {
        String hql = "Select course_id as CourseId from Selection where student_id = ?";
        Query query = sessionFactory.getCurrentSession().createSQLQuery(hql);
        query.setString(0,student_id);
        ArrayList<String> courseId=(ArrayList<String>)query.list();
        return courseId;
    }
}
