package daoImpl;

import dao.PersonalAssignmentAnswerDao;
import model.PersonalAssignmentAnswer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public class PersonalAssignmentAnswerDaoImpl extends DaoImpl<PersonalAssignmentAnswer,String> implements PersonalAssignmentAnswerDao {
    @Override
    public List<PersonalAssignmentAnswer> getAnswerByAssignmentId(String assignmentId) {
        if (assignmentId!=null)
        {
            String hql="from PersonalAssignmentAnswer n where n.assignmentId=?";
            List<Object> params = new ArrayList<Object>(0);
            params.add(assignmentId);
            return super.hqlFind(hql,params.toArray(),false);
        }
        return null;
    }
}
