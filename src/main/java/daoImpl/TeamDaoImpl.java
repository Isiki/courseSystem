package daoImpl;

import dao.TeamDao;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.Team;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
@Repository("TeamDao")
public class TeamDaoImpl implements TeamDao{
    @Autowired
    private SessionFactory sessionFactory;

    public int createTeam(Team team) {
        sessionFactory.getCurrentSession().save(team);
        return 0;
    }
}
