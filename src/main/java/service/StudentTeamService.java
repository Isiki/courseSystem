package service;

import model.Student;
import model.Team;
import model.TeamApplication;
import model.TeamApplicationPK;

import java.util.List;

/**
 * Created by Mouze on 2016/7/10.
 */
public interface StudentTeamService {

    boolean         canStudentCreateTeamInCourse(String course_id, String student_id);
    boolean         createTeamInCourse(Team team, String course_id); // returns success
    boolean applyForTeam(String studentId, String teamId);
    boolean permitapply(TeamApplicationPK pk);
    List<TeamApplication> consultapply(String teamId);
    boolean denyapply(TeamApplicationPK pk);
    String  isTeamLeader(String sid,String cid);
}
