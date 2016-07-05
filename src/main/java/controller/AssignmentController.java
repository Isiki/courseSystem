package controller;

import model.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import service.AssignmentService;

import javax.servlet.http.HttpSession;
import entity.BaseException;
/**
 * Created by isiki on 2016/7/4.
 */
@Controller
@RequestMapping("assignment")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;
    @RequestMapping("add_assignment")
    public String addAssignment() {
        return "assignment/add_assignment";
    }

    @RequestMapping("save_assignment")
    @ResponseBody
    public String saveAssignment(Assignment assignment, HttpSession session) {
            assignment.setIdInCourse(assignmentService.consultAssignmentNumber(assignment.getCourseId()));
            assignmentService.insertAssignment(assignment);
            return "success";

    }
}
