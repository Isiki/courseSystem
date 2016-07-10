package controller;

import entity.AjaxResponse;
import entity.BaseException;
import entity.ERROR;
import model.Course;
import model.Student;
import model.Team;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.TeamService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import util.UserSession;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by 陌上花开 on 2016/7/5.
 */
@Controller
public class TeamController {
    @Autowired
    private TeamService teamService;

   @RequestMapping(value = "createTeam")
    public String CreateTeam(){
        return "createTeam";
    }


    @RequestMapping(value = "createTeamAction")
    public
    @ResponseBody
    String saveUserInfo( String course_id,String student_id, String team_name,String description){
        AjaxResponse response = new AjaxResponse();
        String result =teamService.createTeam(course_id,student_id,team_name,description);
            return result;

    }


    @ExceptionHandler(Exception.class)
    public
    @ResponseBody
    AjaxResponse handleExcxeption(Exception e) {
        AjaxResponse response = new AjaxResponse();
        if (e instanceof BaseException) {
            BaseException exception = (BaseException) e;
            response.setCode(exception.getErrorCode());
            response.setMsg(exception.getMsg());
        } else {
            response.setCode(ERROR.UNKNOWN_ERROR);
            response.setMsg(ERROR.hashMap.get(ERROR.UNKNOWN_ERROR));
            e.printStackTrace();
        }
        return response;
    }


    @RequestMapping(value="s/team.do",method = RequestMethod.GET)
    public void studentGetTeamsInCourse(@RequestParam("course_id") String c_id,
                                        HttpSession session,
                                        Model model){
        List<Team> teams = teamService.getTeamsInCourse(c_id);
        model.addAttribute("teams", teams);
    }

    @RequestMapping(value = "s/team_detail.do", method = RequestMethod.GET)
    public void studentSearchTeam(@RequestParam("value") String val,
                           @RequestParam("method") String meth,
                           @RequestParam("course_id") String c_id,
                           Model model) {
        Team team = null;
        if (meth.equals("ById"))
            team = teamService.searchTeamById(val,c_id);
        else if (meth.equals("ByName"))
            team = teamService.searchTeamByName(val,c_id);

        List<Team> teams = new ArrayList<Team>();
        teams.add(team);
        model.addAttribute("teams", teams);
    }


    @RequestMapping(value = "join_team")
    public String joinTeam(@RequestParam("team_id")String team_id,
                           @RequestParam("course_id")String course_id,
                           @RequestParam("student_id")String student_id,
                           Model model){
        String result = teamService.joinTeam(team_id,course_id,student_id);
        model.addAttribute("result",result);
        return "join_team_result";
    }


}
