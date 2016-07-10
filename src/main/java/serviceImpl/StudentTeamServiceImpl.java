package serviceImpl;

import dao.TeamDao;
import model.Student;
import model.Team;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.StudentTeamService;

import java.util.List;

/**
 * Created by Mouze on 2016/7/10.
 */
@Service
public class StudentTeamServiceImpl implements StudentTeamService {
    @Autowired
    private TeamDao teamDao;



    @Override
    public boolean canStudentCreateTeamInCourse(String course_id, String student_id) {
        boolean bool=teamDao.canStudentCreateTeamInCourse(course_id,student_id);
        return bool;
    }

    @Override
    public boolean createTeamInCourse(Team team, String course_id) {
        boolean bool = teamDao.createTeamInCourse(team, course_id);
        return bool;
    }
}
