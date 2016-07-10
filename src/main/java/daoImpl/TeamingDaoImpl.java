package daoImpl;

import dao.TeamingDao;
import model.Teaming;
import model.TeamingPK;
import org.springframework.stereotype.Repository;

/**
 * Created by andyz_000 on 2016/7/10.
 */
@Repository("TeamingDao")
public class TeamingDaoImpl extends DaoImpl<Teaming, TeamingPK> implements TeamingDao{
}
