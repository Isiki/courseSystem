package serviceImpl;

import model.Student;
import model.Team;
import org.springframework.stereotype.Service;
import service.StudentTeamService;

import java.util.List;

/**
 * Created by Mouze on 2016/7/10.
 */
@Service
public class StudentTeamServiceImpl implements StudentTeamService {
    @Override
    public List<Student> getStudentsInTeam(String team_id) {
        return null;
    }

    @Override
    public Team getStudentTeamInCourse(String course_id, String student_id) {
        return null;
    }

    @Override
    public List<Team> getAllTeamsUnderCourse(String course_id) {
        return null;
    }

    @Override
    public boolean canStudentCreateTeamInCourse(String course_id, String student_id) {
        return false;
    }

    @Override
    public boolean createTeamInCourse(Team team, String course_id) {
        return false;
    }
}
