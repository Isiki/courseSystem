package controller;

import model.Assignment;
import model.Course;
import model.PersonalAssignmentAnswer;
import model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.AssignmentAnswerService;
import service.AssignmentService;
import service.FileService;
import service.StudentService;
import util.PageResultSet;
import util.UserSession;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
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
    @Autowired
    private FileService fileService;
    @Autowired
    private AssignmentAnswerService answerService;



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

    @RequestMapping(value = "/student/savePAttach_action")
    public void savePAttach(HttpServletRequest request, HttpServletResponse response, HttpSession session){
        String aid = request.getParameter("id");
        String uid = (String) session.getAttribute("id");
        String resURL = request.getSession().getServletContext().getRealPath("/uploadFiles/assignment/"+aid+"/"+uid);
        File f = new File(resURL);
        if(!f.exists())
            f.mkdirs();
        else for (File df:f.listFiles()) {
            df.delete();
        }
        try {
            fileService.saveFile(request, resURL);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/student/savePAnswer_action")
    public void savePAnswer(HttpServletRequest request, HttpServletResponse response, HttpSession session){
        PersonalAssignmentAnswer answer = new PersonalAssignmentAnswer();
        String aid = request.getParameter("id");
        String uid = new UserSession(session).getUserId();
        String resURL = request.getSession().getServletContext().getRealPath("/uploadFiles/assignment/"+aid+"/"+uid);
        answer.setAssignmentId(aid);
        answer.setStudentId(uid);
        answer.setText(request.getParameter("text"));
        answer.setAttachmentUrl(resURL);
        if (answerService.insertPAnswer(answer))
            response.setStatus(HttpServletResponse.SC_OK);
        else
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
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
