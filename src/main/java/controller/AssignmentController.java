package controller;

import dao.CourseDao;
import model.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import service.AssignmentService;

import javax.servlet.http.HttpSession;
import entity.BaseException;
import service.CourseService;
import util.UserSession;

import java.text.SimpleDateFormat;

/**
 * Created by isiki on 2016/7/4.
 */
@Controller
@RequestMapping("teacher")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;
    @Autowired
    private CourseService courseService;
    @RequestMapping("add_assignment")
    public String addAssignment(String courseId,Model model) {
        model.addAttribute("course",courseService.searchCourseById(courseId));
        return "assignment/add_assignment";
    }

    @RequestMapping("save_assignment")
    @ResponseBody
    public String saveAssignment(Assignment assignment, @ModelAttribute("startDate") String startDate , @ModelAttribute("endDate")String endDate, HttpSession session) {
        assignment.setIdInCourse(assignmentService.consultAssignmentNumber(assignment.getCourseId()));
        SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd" );
        try {
            assignment.setStartTime(dateFormat.parse(startDate));
            assignment.setEndTime(dateFormat.parse(endDate));
        }catch (Exception e){
            System.out.println(e);
            return "fail";
        }
/*        assignment.setId("7");*/
            assignmentService.insertAssignment(assignment);
        return "success";

    }
}
