package controller;

import dao.AssignmentAnswerDao;
import model.PersonalAssignmentAnswer;
import model.TeamAssignmentAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.AssignmentAnswerService;

import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
@Controller
public class AssignmentAnswerController {
    @Autowired
    private AssignmentAnswerService assignmentAnswerService;

    @RequestMapping(value = "searchpersonalassignmentanswer",method = RequestMethod.POST)
    public String searchPersonalAssignmentAnswer(@RequestParam("method")String meth,@RequestParam("value")String val,Model model)
    {
        if(meth.equals("ById"))
        {
            List<PersonalAssignmentAnswer> personalAssignmentAnswers=assignmentAnswerService.getPersonalAnswerByStudentId(val);
            model.addAttribute("personalassignmentanswers",personalAssignmentAnswers);
        }
        else if(meth.equals("ByCourse"))
        {
            List<PersonalAssignmentAnswer> personalAssignmentAnswers=assignmentAnswerService.getPersonalAnswerByCourseId(val);
            model.addAttribute("personalassignmentanswers",personalAssignmentAnswers);
        }
        return "searchresult";
    }
    @RequestMapping(value = "searchpersonalassignmentanswer",method = RequestMethod.POST)
    public String searchTeamAssignmentAnswer(@RequestParam("method")String meth,@RequestParam("value")String val,Model model)
    {
        if(meth.equals("ById"))
        {
            List<TeamAssignmentAnswer> teamAssignmentAnswers=assignmentAnswerService.getTeamAnswerByTeamId(val);
            model.addAttribute("teamassignmentanswers",teamAssignmentAnswers);
        }
        else if(meth.equals("ByCourse"))
        {
            List<TeamAssignmentAnswer> teamAssignmentAnswers=assignmentAnswerService.getTeamAnswerByCourseId(val);
            model.addAttribute("teamassignmentanswers",teamAssignmentAnswers);
        }
        return "searchresult";
    }
}
