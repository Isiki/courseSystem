package dao;
import model.Team;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
public interface TeamDao extends Dao<Team,String>{
    public int createTeam(Team team);
}
