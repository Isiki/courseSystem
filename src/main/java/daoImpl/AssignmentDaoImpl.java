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

import java.util.ArrayList;
import java.util.List;

/**
 * Created by isiki on 2016/7/4.
 */
@Repository("AssignmentDao")
public class AssignmentDaoImpl extends DaoImpl<Assignment,String> implements AssignmentDao{
    @Override
    public int countByCourseId(String courseId) {
        List<Object> params = new ArrayList<Object>(0);
        String hql="from Assignment n where n.id is not null and n.courseId = ?";
        params.add(courseId);
        return super.hqlFind(hql,params.toArray(),false).size();
    }
}
