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

    @RequestMapping(value = "assignmentanswer",method = RequestMethod.POST)
    public void showAssignmentsWithSubmitStatus(@RequestParam("studentId")String id, Model model)
    {

    }

}
