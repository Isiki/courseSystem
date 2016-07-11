package controller;

import jxl.write.DateTime;
import model.*;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.SystemEnvironmentPropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import service.FileService;
import service.StudentAssignmentService;
import service.StudentTeamService;
import service.TeamService;
import util.UserSession;
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
    private AssignmentService assignmentService;

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

        List<Course> courses = studentService.getAllCourseById(student_id);
        List<Map<String, Object>> coursesMP = courseService.getCourseWithTeacherAndTeamAllowedByStudentId(student_id);
        List<Map<String, Object>> assignments = saService.getAssignmentsWithCourseAndSubmission(student_id);

        model.addAttribute("courses", courses);
        model.addAttribute("coursesMP", coursesMP);
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
        request.getSession().setAttribute("course_name", c.getCourseName());

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/text;charset=utf-8");
        try {
            response.getWriter().append("resource.do");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /* 学生资源页面
     * 返回学生资源页面，详情咨询赵天宇
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
        String student_id = getStudentIdInSession(request.getSession());

        List<Map<String, Object>> pAssignments =
                saService.getAllAssignmentsWithSubmissionStatusMP(course_id, student_id);

        model.addAttribute("pAssignments", pAssignments);

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
        String student_id = getStudentIdInSession(request.getSession());

        Assignment ass = assignmentService.getAssignmentById(assignment_id);
        Course c = courseService.getCourseById(ass.getCourseId());

        request.getSession().setAttribute("course_id", ass.getCourseId());
        request.getSession().setAttribute("course_name", c.getCourseName());

        //int atype = assignmentService.getAssignmentTeamType(assignment_id);
        int atype = ass.getIsTeamwork()?1:0;

        // REMINDER: this edition is not in PDF:
        model.addAttribute("assignment", ass);
        // END REMINDER

        if(AssignmentTeamType.PERSONAL == atype) {
            PersonalAssignmentAnswer paa = saService.getMySubmission(assignment_id, student_id);
            if(paa != null) model.addAttribute("pAssignmentAnswer", paa);
            model.addAttribute("teamType", "personal");
        }
        else if(AssignmentTeamType.TEAM == atype) {
            TeamAssignmentAnswer taa = saService.getTeamSubmission(assignment_id, student_id);
            if(taa != null) model.addAttribute("tAssignmentAnswer", taa);
            model.addAttribute("teamType", "team");
        }
        //return "assignment_detail";
        return "hand_in";
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
            fileService.saveFile(request, targetUrl);
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
        boolean isTeamLeader;

        if(hasTeam) {
            String a=team.getTeamleaderId();
            if(a.equals(student_id)) {
                isTeamLeader= true;
                List<TeamApplication> apps=stService.consultapply(team.getId());
                model.addAttribute("applications",apps);
                model.addAttribute("appAmount",apps.size());
            }
            else{
                isTeamLeader = false;
            }
            List<Student> studentsIn = teamService.getStudentsInTeam(team.getId());
            model.addAttribute("theTeam", team);
            model.addAttribute("isTeamLeader",isTeamLeader);
            model.addAttribute("studentsIn", studentsIn);

        } else {
           //List<Team> teams = teamService.getAllTeamsUnderCourse(course_id);
            //model.addAttribute("teams", teams);

            List<Map<String,Object>> list=new ArrayList<>();
            list=teamService.getAllTeamWithLeader(course_id);
            model.addAttribute("list", list);
        }

        return "team";
    }


    /* 处理创建团队请求*/
    @RequestMapping(value = "team_create")
    public void teamCreateHandler(HttpServletRequest request, HttpServletResponse response){
        String courseId = getCourseIdInSession(request.getSession());
        String studentId = getStudentIdInSession(request.getSession());

        String teamName = request.getParameter("team_name");
        String teamDescription = request.getParameter("team_description");

        Team team = new Team();
        team.setCourseId(courseId);
        team.setIsFull(false);
        team.setTeamName(teamName);
        team.setTeamDescription(teamDescription);
        team.setTeamleaderId(studentId);

        if(stService.createTeamInCourse(team, courseId)) {
            stService.clearTeamAppByStudentId(studentId,courseId);
            response.setStatus(HttpServletResponse.SC_OK);
        }
        else response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }


    /* 处理加入团队请求
     * 具体实现方式未讨论
     */
    @RequestMapping(value = "apply_team")
    public void joinTeam(HttpServletRequest request, HttpServletResponse response) {
        UserSession user = new UserSession(request.getSession());
        String userId = user.getUserId();
        String teamId = request.getParameter("team_id");
        String description = request.getParameter("description");
        if(stService.applyForTeam(userId, teamId, description)) {
            response.setStatus(HttpServletResponse.SC_OK);
        }
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
    /*public String joinTeam(String team_id, HttpSession session){
        // 学生类型
        UserSession user = new UserSession(session);
        if(stService.applyForTeam(user.getUserId(),team_id)) {
            return "success";
        }
        else{
            return "failed";
        }
    }*/

    @RequestMapping(value = "team_app", method = RequestMethod.GET)
    public String consultTeamApplication(Model model,HttpSession session){
        // 学生类型
        UserSession user = new UserSession(session);
        Team team=teamService.getStudentTeamInCourse(user.getCourse().getId(),user.getUserId());
        if(team.getTeamleaderId()==user.getUserId()) {
            List<TeamApplication> apps=stService.consultapply(team.getId());
            model.addAttribute("isTeamLeader","true");
            model.addAttribute("applications",apps);
            model.addAttribute("appAmount",apps.size());
        }else{
            model.addAttribute("isTeamLeader","false");
        }
        return "team_application";
    }

    @RequestMapping(value = "commit_team_app")
    public void commitTeamApplication(HttpServletRequest request, HttpServletResponse reponse){
        String studentId = request.getParameter("student_id");
        String team_id = request.getParameter("team_id");
        TeamApplicationPK pk = new TeamApplicationPK();
        pk.setStudentId(studentId);
        pk.setTeamId(team_id);
        stService.permitapply(pk);
        reponse.setStatus(HttpServletResponse.SC_OK);
    }

    @RequestMapping(value = "deny_team_app")
    public void denyTeamApplication(HttpServletRequest request, HttpServletResponse reponse){
        String studentId = request.getParameter("student_id");
        String team_id = request.getParameter("team_id");
        TeamApplicationPK pk = new TeamApplicationPK();
        pk.setStudentId(studentId);
        pk.setTeamId(team_id);
        stService.denyapply(pk);
        reponse.setStatus(HttpServletResponse.SC_OK);
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
