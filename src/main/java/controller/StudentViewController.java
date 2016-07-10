package controller;

import jxl.write.DateTime;
import model.*;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// model返回值使用驼峰命名法
// 请求参数、函数形参使用下划线分割命名法

/**
 * Created by Mouze on 2016/7/9.
 */
@Controller
@RequestMapping(value = "s")
public class StudentViewController {

    @Autowired
    private StudentAssignmentService saService;

    @Autowired
    private StudentTeamService stService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private TeamService teamService;

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
        String student_id = getStudentIdInSession(request.getSession());
        List<Course> courses =
                studentService.getAllCourseById(student_id);
        List<Assignment> assignments =
                saService.getAssignmentsWithCourseAndSubmissions(student_id);

        model.addAttribute("courses", courses);
        model.addAttribute("assignments", assignments);
        return "workspace";
    }


    /* 进入课程首页的导航函数
     * 将目前所选课程写入session，并返回模板
     */
    @RequestMapping(value = "course_navigate", method = RequestMethod.GET)
    public String showCourseEntry(HttpServletRequest request, Model model) {
        String course_id = request.getParameter("course_id");
        request.getSession().setAttribute("course_id", course_id);
        return "course";
    }


    /* 学生资源页面
     * 返回学生资源页面，详情咨询赵天宇
     * session.getAttribute("course_id")
     */
    @RequestMapping(value = "resource", method = RequestMethod.GET)
    public String showResource(HttpServletRequest request, Model model) {
        // i know nothing about this.
        return "resource";
    }


    /* 显示课程下作业列表
     * model return value
     * pAssignments:    带有is_submitted属性的assignment对象列表(List<Map<String, Object>>)
     */
    @RequestMapping(value = "assignment", method = RequestMethod.GET)
    public String showAssignment(HttpServletRequest request, Model model){
        String course_id = getCourseIdInSession(request.getSession());
        String student_id = getStudentIdInSession(request.getSession());

        List<Map<String, Object>> pAssignments =
                saService.getAllAssignmentsWithSubmissionStatusMP(course_id, student_id);

        model.addAttribute("pAssignments", pAssignments);

        return "assignment";
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
        String student_id = getStudentIdInSession(request.getSession());

        int atype = saService.getAssignmentTeamType(assignment_id);

        if(AssignmentTeamType.PERSONAL == atype) {
            PersonalAssignmentAnswer paa = saService.getMySubmission(assignment_id, student_id);
            model.addAttribute("pAssignmentAnswer", paa);
            model.addAttribute("teamType", "personal");
        }
        else if(AssignmentTeamType.TEAM == atype) {
            TeamAssignmentAnswer taa = saService.getTeamSubmission(assignment_id, student_id);
            model.addAttribute("tAssignmentAnswer", taa);
            model.addAttribute("teamType", "team");
        }
        return "assignment_detail";
    }

    /* 上传文件的后端处理函数
     * 实现参考ResourceController.saveResource (by 赵天宇)
     * params
     * rich_text
     * file_upload
     */

    @Autowired
    private FileService fileService;
    @RequestMapping(value = "assignment_submit", method = RequestMethod.POST)
    public void submitHandler(HttpServletRequest request, HttpServletResponse response){
        PrintWriter responseWriter = null;
        String targetUrl = request.getSession()
                                  .getServletContext()
                                  .getRealPath("/uploadFiles/assignments");
        try {
            File uploadFile = fileService.saveFile(request, targetUrl);
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.setStatus(HttpServletResponse.SC_OK);

            Map<String, Object> retVals = new HashMap<>();
            retVals.put("success", "false");
            String jsonStr = getJsonFromMap(retVals).toString();

            responseWriter = response.getWriter();
            responseWriter.append(jsonStr);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if(responseWriter != null) responseWriter.close();
        }
    }




    /* 显示team信息或team列表（有一个小判断-分转）
     * model return values
     * hasTeam: "true"/"false" 该用户是否已属于某个团队
     * team:                   该用户所属团队          (when hasTeam is true)
     * studentsIn:             该用户所属团队的成员表  (when hasTeam is true)
     * teams:                  该课程所有团队列表      (when hasTeam is false)
     */
    @RequestMapping(value = "team", method = RequestMethod.GET)
    public String showTeam(HttpServletRequest request, Model model){
        String course_id = getCourseIdInSession(request.getSession());
        String student_id = getStudentIdInSession(request.getSession());

        Team team = teamService.getStudentTeamInCourse(course_id, student_id);
        boolean hasTeam = (null!=team);
        model.addAttribute("hasTeam", (hasTeam?"true":"false"));

        if(hasTeam) {
            List<Student> studentsIn = teamService.getStudentsInTeam(team.getId());
            model.addAttribute("team", team);
            model.addAttribute("studentsIn", studentsIn);
        } else {
            List<Team> teams = teamService.getAllTeamsUnderCourse(course_id);
            model.addAttribute("teams", teams);
        }

        return "team";
    }


    /* 显示创建团队的界面
     * 首先需要确认该课程/学生组合是否满足新建团队的条件，如不满足返回错误页面
     */
    @RequestMapping(value = "team_create", method = RequestMethod.GET)
    public String showCreateTeam(HttpServletRequest request, Model model){
        String course_id = getCourseIdInSession(request.getSession());
        String student_id = getStudentIdInSession(request.getSession());

        boolean isValid = stService.canStudentCreateTeamInCourse(course_id, student_id);
        if(isValid) return "team_create";

        return "team_creation_invalid";
    }


    /* 处理创建团队请求
     * 接受一个team作为参数，其中leader_id已经在前台填写完毕
     * model return values
     * success: "true"/"false"
     */
    @RequestMapping(value = "team_create", method = RequestMethod.POST)
    public String teamCreateHandler(HttpServletRequest request, Team team, Model model){
        String course_id = getCourseIdInSession(request.getSession());
        //String student_id = getStudentIdInSession(request.getSession());
        // student id already got in session at frontend

        boolean success = stService.createTeamInCourse(team, course_id);
        model.addAttribute("success", success?"true":"false");

        return "team_create";
    }


    /* 处理加入团队请求
     * 具体实现方式未讨论
     */
    @RequestMapping(value = "team_join", method = RequestMethod.POST)
    public void joinTeam(HttpServletRequest request, HttpServletResponse response){
        // undefined
    }

/* ------------------------ Util functions below ------------------------------ */

    private String getCourseIdInSession(HttpSession session) {
        return (String)session.getAttribute("course_id");
    }

    // if a user reaches this function,
    // s/he is already has userType = "student"
    // so just get attribute "id"
    private String getStudentIdInSession(HttpSession session) {
        return (String)session.getAttribute("id");
    }

    private JSONObject getJsonFromMap(Map<String, Object> map){
        JSONObject obj = new JSONObject();
        obj.putAll(map);
        return obj;
    }


}
