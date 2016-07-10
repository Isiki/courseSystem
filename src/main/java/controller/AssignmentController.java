package controller;

import dao.CourseDao;
import model.Assignment;
import model.Course;
import model.PersonalAssignmentAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import service.AssignmentAnswerService;
import service.AssignmentService;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import entity.BaseException;
import service.CourseService;
import service.StudentService;
import util.UserSession;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import static java.lang.System.in;

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
    @Autowired
    private AssignmentAnswerService aaService;
    @Autowired
    private StudentService studentService;

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
