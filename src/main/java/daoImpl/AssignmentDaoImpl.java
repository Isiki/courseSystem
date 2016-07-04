package daoImpl;

import dao.AssignmentDao;
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
        return sessionFactory.getCurrentSession().get(Assignment.class,id);
    }

    @RequestMapping(value = "/admin/addtask_action")
    public
    @ResponseBody
    AjaxResponse addTaskAction(Task task, BindingResult result) throws BaseException {
        AjaxResponse response = new AjaxResponse();
        task.setId(task.getTaskNumber() + ":" + task.getTaskDate());
        task.setAppendRation(0);
        taskService.insertTask(task);
        return response;
    }


}
