package dao;

import model.TeamApplication;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/10.
 */
public interface TeamApplicationDao extends Dao<TeamApplication,String> {
    List<TeamApplication> searchApplicationByCourseId(String id);
    List<TeamApplication> searchApplicationByTeamId(String teamId);
}
