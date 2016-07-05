package daoImpl;

import dao.AssignmentDao;
import entity.AjaxResponse;
import entity.BaseException;
import model.Assignment;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by isiki on 2016/7/4.
 */
@Repository("AssignmentDao")
public class AssignmentDaoImpl implements AssignmentDao{
    @Autowired
    private SessionFactory sessionFactory;
    public Assignment getAssignmentById(String id) {
        Assignment assignment = (Assignment) sessionFactory.getCurrentSession().get(Assignment.class,id);
        return assignment;
    }

    public void insertAssignment(Assignment assignment) {
        sessionFactory.getCurrentSession().save(assignment);
    }


}
