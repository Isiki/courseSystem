package controller;

import model.*;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import service.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.ref.ReferenceQueue;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Mouze on 2016/7/10.
 */
@Controller
@RequestMapping(value = "t")
public class TeacherViewController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private TeacherAssignmentService taService;

    @Autowired
    private TeamService teamService;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private CourseService courseService;



    /* 学生工作空间
     * 返回工作空间页面，并加载课程列表栏和作业总表
     *
     * model return values
     * courses:         学生所在的课程列表
     * assignments:     学生各个课程的作业总表
     */
    @RequestMapping(value = "workspace", method = RequestMethod.GET)
    public String showWorkspace(HttpServletRequest request, Model model) {
        String teacher_id = getTeacherIdInSession(request.getSession());

        List<Course> courses = teacherService.getCourses(teacher_id);
        List<Assignment> assignments = taService.getAllAssignmentsOfTeacher(teacher_id);

        model.addAttribute("courses", courses);
        model.addAttribute("assignments", assignments);
        return "workspace";
    }


    /* 进入课程首页的导航函数
     * 将目前所选课程写入session，并返回模板
     */
    @RequestMapping(value = "course_navigate", method = RequestMethod.GET)
    public void showCourseEntry(HttpServletRequest request, HttpServletResponse response) {

        String course_id = request.getParameter("course_id");
        request.getSession().setAttribute("course_id", course_id);

        Course c = courseService.getCourseById(course_id);
        request.getSession().setAttribute("team_allowed",c.isTeamAllowed());
        request.getSession().setAttribute("course_name", c.getCourseName());

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/text;charset=utf-8");
        try {
            response.getWriter().append("resource.do");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    /* 教师资源页面
     * 返回教师资源页面，详情咨询赵天宇
     * session.getAttribute("course_id")
     */
    /*@RequestMapping(value = "resource", method = RequestMethod.GET)
    public String showResource(HttpServletRequest request, Model model) {
        // i know nothing about this.
        return "resource";
    }*/


    /* 显示课程下作业列表
     * model return value
     * pAssignments:    带有is_submitted属性的assignment对象列表(List<Map<String, Object>>)
     */
    @RequestMapping(value = "assignment", method = RequestMethod.GET)
    public String showAssignment(HttpServletRequest request, Model model){
        String course_id = getCourseIdInSession(request.getSession());
        //String teacher_id = getTeacherIdInSession(request.getSession());

        List<Assignment> assignments = assignmentService.getAllByCourseId(course_id);
        model.addAttribute("assignments", assignments);

        return "assignmentlist";
    }


    /* 显示作业详情
     * params
     * assignment_id:               作业ID
     * model return values
     * p/t AssignmentAnswer:        作业实体
     * teamType: ("personal"/"team")
     */
    class AssignmentTeamType {
        public static final int PERSONAL = 0;
        public static final int TEAM = 1;
    }
    @RequestMapping(value = "assignment_detail", method = RequestMethod.GET)
    public String showAssignmentDetail(HttpServletRequest request,
                                       Model model)
    {
        String assignment_id = request.getParameter("assignment_id");
        Assignment assignment = assignmentService.getAssignmentById(assignment_id);
        //String teacher_id = getTeacherIdInSession(request.getSession());

        int atype = assignmentService.getAssignmentTeamType(assignment_id);
        Course c = courseService.getCourseById(assignment.getCourseId());
        request.getSession().setAttribute("course_id", c.getId());
        request.getSession().setAttribute("course_name", c.getCourseName());

        model.addAttribute("assignment", assignment);
        if(StudentViewController.AssignmentTeamType.PERSONAL == atype) {
            //List<PersonalAssignmentAnswer> paas = taService.getAllPersonalSubmissions(assignment_id);
            List<Map<String, Object>> paas = taService.getAllAssignmentSubmissions(assignment_id, false);
            model.addAttribute("assignmentAnswers", paas);
            model.addAttribute("teamType", "personal");
        }
        else if(StudentViewController.AssignmentTeamType.TEAM == atype) {
            //List<TeamAssignmentAnswer> taas = taService.getAllTeamSubmissions(assignment_id);
            List<Map<String, Object>> taas = taService.getAllAssignmentSubmissions(assignment_id, true);
            model.addAttribute("assignmentAnswers", taas);
            model.addAttribute("teamType", "team");
        }
        return "nfe/assignment_detail";
    }



    /*
     * 教师查看当前课程所有团队
     */
    @RequestMapping(value = "team", method = RequestMethod.GET)
    public String showTeam(HttpServletRequest request, Model model){
        String course_id = getCourseIdInSession(request.getSession());
        List<Map<String,Object>> list = teamService.getAllTeamWithLeader(course_id);
        model.addAttribute("teams", list);
        return "team";
    }



    /* 打开批改作业页面
     * reference: 张威
     * @RequestParams:
     *      teamType: "personal" / "team"
     *
     */
    //@RequestMapping(value = "check_assignment", method = RequestMethod.GET)
    //public String checkAssignment(...){}


    /* 批改作业
     * reference: 张威
     */
    //@RequestMapping(value = "check_team_assignment", method = RequestMethod.POST)
    //public void checkTeamAssignment(...){}
    //@RequestMapping(value = "check_personal_assignment", method = RequestMethod.POST)
    //public void checkPersonalAssignment(...){}


/* ------------------------ Util functions below ------------------------------ */

    private String getCourseIdInSession(HttpSession session) {
        return (String)session.getAttribute("course_id");
    }

    // if a user reaches this function,
    // s/he is already has userType = "teacher"
    // so just get attribute "id"
    private String getTeacherIdInSession(HttpSession session) {
        return (String)session.getAttribute("id");
    }

    private JSONObject getJsonFromMap(Map<String, Object> map){
        JSONObject obj = new JSONObject();
        obj.putAll(map);
        return obj;
    }

}
