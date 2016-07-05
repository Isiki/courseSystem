package daoImpl;

import dao.TeacherDao;
import model.Teacher;
import org.springframework.stereotype.Repository;

/**
 * Created by andyz_000 on 2016/7/4.
 */
@Repository("TeacherDao")
public class TeacherDaoImpl extends DaoImpl<Teacher,String> implements TeacherDao{
}
