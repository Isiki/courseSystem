package serviceImpl;

import dao.TeacherDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.TeacherService;

/**
 * Created by andyz_000 on 2016/7/4.
 */
@Service
public class TeacherServiceImpl implements TeacherService {
    @Autowired
    private TeacherDao teacherDao;

    @Override
    public boolean teacherLogin(String id) {
        if(teacherDao.get(id)!=null){
            return true;
        }
        return false;
    }
}
