package dao;

import model.TeamApplication;
import model.TeamApplicationPK;

import java.util.List;

/**
 * Created by andyz_000 on 2016/7/10.
 */
public interface TeamApplicationDao extends Dao<TeamApplication, TeamApplicationPK> {
    List<TeamApplication> searchApplicationByCourseId(String studentId, String courseId);
    List<TeamApplication> searchApplicationByTeamId(String teamId);
}
