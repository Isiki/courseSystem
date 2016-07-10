package daoImpl;

import dao.AssignmentDao;
import model.Assignment;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by isiki on 2016/7/4.
 */
@Repository("AssignmentDao")
public class AssignmentDaoImpl extends DaoImpl<Assignment,String> implements AssignmentDao{
    @Autowired
    private SessionFactory sessionFactory;

    public Assignment getAssignmentById(String id) {
        Assignment assignment = (Assignment) sessionFactory.getCurrentSession().get(Assignment.class,id);
        return assignment;
    }

    public void insertAssignment(Assignment assignment) {
        sessionFactory.getCurrentSession().save(assignment);
    }

    public ArrayList<Assignment> getAllByCourseId(String id){
        String sql = "select * from assignment where course_id='"+id+"'";
        Query query = sessionFactory.getCurrentSession().createSQLQuery(sql).addEntity(Assignment.class);
        ArrayList<Assignment> assignments=(ArrayList<Assignment>)query.list();
        if (assignments==null)
            assignments = new ArrayList<Assignment>();
        return assignments;
    }

    @Override
    public int countByCourseId(String courseId) {
        List<Object> params = new ArrayList<Object>(0);
        String hql="from Assignment n where n.id is not null and n.courseId = ?";
        params.add(courseId);
        return super.hqlFind(hql,params.toArray(),false).size();
    }
    public List<Map<String, Object>> allAssignmentsWithSubmissionStatusMP(String course_id, String student_id){
        Query query1=sessionFactory.getCurrentSession()
                .createSQLQuery(
                        "select heading,course_name,start_time,end_time,is_teamwork,total_grade,grade,is_submitted " +
                        "from assignment " +
                        "left join personalassignmentanswer on assignment.id=personalassignmentanswer.assignment_id " +
                        "left join course on assignment.course_id = course.id " +
                        "where course_id=\'"+course_id+"\' and student_id=\'"+student_id+"\'"
                );
        List<Object[]> personalResult = query1.list();
        List<Map<String, Object>> targetList = new ArrayList<>();
        for(Object[] line : personalResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("heading", line[0]);
            tmp.put("course_name", line[1]);
            tmp.put("start_time", line[2]);
            tmp.put("end_time", line[3]);
            tmp.put("is_teamwork", line[4]);
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted", line[7]!=null?"true":"false");
            targetList.add(tmp);
        }

        Query query2=sessionFactory.getCurrentSession()
                .createSQLQuery(
                        "select heading,course_name,start_time,end_time,is_teamwork,total_grade,grade,is_submitted " +
                                "from assignment " +
                                "left join teamassignmentanswer on assignment.id=teamassignmentanswer.assignment_id " +
                                "left join course on assignment.course_id = course.id " +
                                "left join teaming on teaming.team_id=teamassignmentanswer. team_id"+
                                "where course_id=\'"+course_id+"\' and student_id=\'"+student_id+"\'"
                );
        List<Object[]> teamResult = query2.list();
        List<Map<String, Object>> targetList1 = new ArrayList<>();
        for(Object[] line : teamResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("heading", line[0]);
            tmp.put("course_name", line[1]);
            tmp.put("start_time", line[2]);
            tmp.put("end_time", line[3]);
            tmp.put("is_teamwork", line[4]);
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted", line[7]!=null?"true":"false");
            targetList1.add(tmp);
        }
        targetList.addAll(targetList1);


        return targetList;
    }

    public List<Map<String,Object>> allAssimentsWithCourseAndSubmission(String student_id){
        Query query1=sessionFactory.getCurrentSession()
                .createSQLQuery(
                        "select heading,course_name,start_time,end_time,is_teamwork,totalgrade,grade,is_submitted " +
                                "from assignment " +
                                "left join personalassignmentanswer on assignment.id=personalassignmentanswer.assignment_id " +
                                "left join course on assignment.course_id = course.id " +
                                "where student_id=\'"+student_id+"\'"
                );
        List<Object[]> personalResult = query1.list();
        List<Map<String, Object>> targetList = new ArrayList<>();
        for(Object[] line : personalResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("heading", line[0]);
            tmp.put("course_name", line[1]);
            tmp.put("start_time", line[2]);
            tmp.put("end_time", line[3]);
            tmp.put("is_teamwork", line[4]);
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted", line[7]!=null?"true":"false");
            targetList.add(tmp);
        }

        Query query2=sessionFactory.getCurrentSession()
                .createSQLQuery(
                        "select heading,course_name,start_time,end_time,is_teamwork,totalgrade,grade,is_submitted " +
                                "from assignment " +
                                "left join teamassignmentanswer on assignment.id=teamassignmentanswer.assignment_id " +
                                "left join course on assignment.course_id = course.id " +
                                "left join teaming on teaming.team_id=teamassignmentanswer.team_id "+
                                "where student_id=\'"+student_id+"\'"
                );
        List<Object[]> teamResult = query2.list();
        List<Map<String, Object>> targetList1 = new ArrayList<>();
        for(Object[] line : teamResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("heading", line[0]);
            tmp.put("course_name", line[1]);
            tmp.put("start_time", line[2]);
            tmp.put("end_time", line[3]);
            tmp.put("is_teamwork", line[4]);
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted", line[7]!=null?"true":"false");
            targetList1.add(tmp);
        }
        targetList.addAll(targetList1);


        return targetList;
    }
}
