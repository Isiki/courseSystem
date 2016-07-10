package service;

import model.Student;
import model.Team;
import model.TeamApplication;

import java.util.List;

/**
 * Created by Mouze on 2016/7/10.
 */
public interface StudentTeamService {
    List<Student>   getStudentsInTeam(String team_id);
    Team            getStudentTeamInCourse(String course_id, String student_id);
    List<Team>      getAllTeamsUnderCourse(String course_id);
    boolean         canStudentCreateTeamInCourse(String course_id, String student_id);
    boolean         createTeamInCourse(Team team, String course_id); // returns success
    boolean applyForTeam(String studentId, String teamId);
    boolean permitapply(String id);
    List<TeamApplication> consultapply(String teamId);
    boolean denyapply(String id);
}
