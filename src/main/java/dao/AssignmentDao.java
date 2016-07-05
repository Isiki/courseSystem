package dao;
import model.Assignment;
/**
 * Created by isiki on 2016/7/4.
 */
public interface AssignmentDao extends Dao{
    int countByCourseId(String courseId);
}
