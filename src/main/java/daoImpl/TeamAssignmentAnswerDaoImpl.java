package daoImpl;

import dao.Dao;
import dao.TeamAssignmentAnswerDao;
import model.PersonalAssignmentAnswer;
import model.Team;
import model.TeamAssignmentAnswer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by andyz_000 on 2016/7/8.
 */
public class TeamAssignmentAnswerDaoImpl extends DaoImpl<TeamAssignmentAnswer,String> implements TeamAssignmentAnswerDao{
    public List<TeamAssignmentAnswer> getAnswerByAssignmentId(String assignmentId) {
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
