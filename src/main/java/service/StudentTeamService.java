package service;

import model.Student;
import model.Team;

import java.util.List;

/**
 * Created by Mouze on 2016/7/10.
 */
public interface StudentTeamService {

    boolean         canStudentCreateTeamInCourse(String course_id, String student_id);
    boolean         createTeamInCourse(Team team, String course_id); // returns success
}
