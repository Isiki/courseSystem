package controller;

import model.Assignment;
import model.Course;
import model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.AssignmentService;
import service.StudentService;
import util.PageResultSet;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 2016/7/5.
 */
@Controller
public class StudentController {
    @Autowired
    private StudentService studentService;
    @Autowired
    private AssignmentService assignmentService;

    @RequestMapping(value = "student/course")
    public String ListCourse(Model model){
        Student student = studentService.getStudentById("12005001");
        ArrayList<Course> course = studentService.getAllCourseById(student.getId());
        PageResultSet<Course> cources = new PageResultSet<>();
        cources.setList(course);
        model.addAttribute("courses",cources);
        return "course";
    }

    @RequestMapping(value = "/student/handin")
    public String handin(String id,Model model){
        Assignment assignment = assignmentService.getAssignmentById(id);
        model.addAttribute("assignment",assignment);
        return "hand_in";
    }

    @RequestMapping(value = "/student/assignmentlist")
    public String listAssignment(String id,Model model){
        ArrayList<Assignment> assignment = assignmentService.getAllByCourseId(id);
        PageResultSet<Assignment> assignments = new PageResultSet<>();
        assignments.setList(assignment);
        model.addAttribute("assignments",assignments);
        return "assignmentlist";
    }

    @RequestMapping(value="searchallstudent",method = RequestMethod.GET)
    public String searchAllStudents(Model model){
        List<Student> student=studentService.getAllStudents();
        model.addAttribute(student);
        return "searchresult";
    }
    @RequestMapping(value="searchstudent",method = RequestMethod.GET)
    public String searchStudents(@RequestParam("method")String meth, @RequestParam("value")String val, Model model){
        if(meth.equals("ById"))
        {
            Student student=studentService.getStudentById(val);
            model.addAttribute("student",student);
        }
        else if(meth.equals("ByName"))
        {
            Student student=studentService.getStudentByName(val);
            model.addAttribute("student",student);
        }
        return "searchresult";
    }

}
