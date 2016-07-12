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


    public int countByCourseId(String courseId) {
        //String hql="select max(n.id) from Assignment as n where n.id is not null and n.courseId = "+courseId;
       // return (int)super.getSession().createQuery(hql).uniqueResult();
        Query query = sessionFactory.getCurrentSession().createSQLQuery(
                "select MAX(id_in_course) from assignment WHERE course_id='"+courseId+"'");
        List<Object> list = query.list();
        if(list.isEmpty()) return 0;
        Integer i  = (Integer) list.get(0);
        return i.intValue();
    }


    public List<Map<String, Object>> allAssignmentsWithSubmissionStatusMP(String course_id, String student_id){
        Query query1=sessionFactory.getCurrentSession()
                .createSQLQuery("select heading,course_name,start_time,end_time,is_teamwork,totalgrade,grade,is_submitted,a.id " +
                        "from (select * from assignment " +
                        "where course_id = \'"+course_id+"\' and is_teamwork = 0 ) as a " +
                        "left join (select * from personalassignmentanswer " +
                        "WHERE student_id=\'"+student_id+"\' ) as b " +
                        "on a.id = b.assignment_id " +
                        "left join course on course.id=course_id;"
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
            tmp.put("is_teamwork", (line[4]!=null&&(byte)line[4]==1)?"true":"false");
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted", (line[7]!=null&&(byte)line[7]==1)?"true":"false");
            System.out.println(line[7]);
            tmp.put("assignment_id", line[8]);
            targetList.add(tmp);
        }

        Query query2=sessionFactory.getCurrentSession()
                .createSQLQuery(
                        "select heading,course_name,start_time,end_time,is_teamwork,totalgrade,grade,is_submitted,a.id " +
                                "from (select * from assignment where course_id =\'"+course_id+"\'" +
                                " and is_teamwork = 1) as a left join (select * from teamassignmentanswer " +
                                "WHERE team_id in (select team_id from teaming where student_id =\'"+student_id+
                                "\'))as b on a.id = b.assignment_id left join course on course.id=course_id;"
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
            tmp.put("is_teamwork", (line[4]!=null&&(byte)line[4]==1)?"true":"false");
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted", (line[7]!=null&&(byte)line[7]==1)?"true":"false");
            System.out.println(line[7]);
            tmp.put("assignment_id", line[8]);
            targetList1.add(tmp);
        }
        targetList.addAll(targetList1);

        return targetList;
    }

    public List<Map<String,Object>> allAssimentsWithCourseAndSubmission(String student_id){
        String psql = "select heading,course_name,start_time,end_time,is_teamwork,totalgrade,grade,is_submitted,a.id\n" +
                " from\n" +
                "(select assignment.* from assignment\n" +
                "left JOIN selection on selection.course_id = assignment.course_id\n" +
                "where selection.student_id=\'"+student_id+"\' and assignment.is_teamwork = 0) as a \n" +
                "left join\n" +
                "(select * from personalassignmentanswer WHERE student_id=\'"+student_id+"\' ) as b\n" +
                "on a.id = b.assignment_id\n" +
                "left join course on course.id=course_id;\n";
        Query query1=sessionFactory.getCurrentSession().createSQLQuery(psql);


        List<Object[]> personalResult = query1.list();
        List<Map<String, Object>> targetList = new ArrayList<>();
        
        for(Object[] line : personalResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("heading", line[0]);
            tmp.put("course_name", line[1]);
            tmp.put("start_time", line[2]);
            tmp.put("end_time", line[3]);
            tmp.put("is_teamwork", (line[4]!=null&&(byte)line[4]==1)?"true":"false");
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted", (line[7]!=null&&(byte)line[7]==1)?"true":"false");
            tmp.put("assignment_id", line[8]);
            targetList.add(tmp);
        }

        String tsql = "select heading,course_name,start_time,end_time,is_teamwork,totalgrade,grade,is_submitted,a.id\n" +
                " from\n" +
                "(select assignment.* from assignment\n" +
                "left JOIN selection on selection.course_id = assignment.course_id\n" +
                "where selection.student_id=\'"+student_id+"\' and assignment.is_teamwork = 1) as a \n" +
                "left join\n" +
                "(select * from teamassignmentanswer WHERE team_id in (select team_id from teaming where student_id = \'"
                +student_id+"\')) as b\n"+"on a.id = b.assignment_id \n" +
                "left join course on course_id = course.id;";
        Query query2=sessionFactory.getCurrentSession().createSQLQuery(tsql);
        List<Object[]> teamResult = query2.list();
        List<Map<String, Object>> targetList1 = new ArrayList<>();
        for(Object[] line : teamResult)
        {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("heading", line[0]);
            tmp.put("course_name", line[1]);
            tmp.put("start_time", line[2]);
            tmp.put("end_time", line[3]);
            tmp.put("is_teamwork", (line[4]!=null&&(byte)line[4]==1)?"true":"false");
            tmp.put("total_grade", line[5]);
            tmp.put("grade", line[6]);
            tmp.put("is_submitted",  (line[7]!=null&&(byte)line[7]==1)?"true":"false");
            tmp.put("assignment_id", line[8]);
            targetList1.add(tmp);
        }
        targetList.addAll(targetList1);


        return targetList;
    }
}
