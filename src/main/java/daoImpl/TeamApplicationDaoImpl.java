package daoImpl;

import dao.TeamApplicationDao;
import model.TeamApplication;
import model.TeamApplicationPK;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/10.
 */
@Repository("TeamAssignmentDao")
public class TeamApplicationDaoImpl extends DaoImpl<TeamApplication, TeamApplicationPK> implements TeamApplicationDao{
    @Override
    public List<TeamApplication> searchApplicationByCourseId(String id) {
        String hql="from TeamApplication n where n.courseId = "+id;
        return super.hqlFind(hql);
    }

    @Override
    public List<TeamApplication> searchApplicationByTeamId(String teamId) {
        String hql="from TeamApplication n where n.teamId = "+teamId;
        return super.hqlFind(hql);
    }
}
