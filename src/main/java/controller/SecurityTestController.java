package controller;


import model.Course;
import model.PersonalAssignmentAnswer;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.CourseService;
import service.StudentService;
import service.TeacherService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;

/**
 * Created by tuomao on 2016/6/2.
 */
@Controller
public class SecurityTestController {
    @Autowired
    private TeacherService teacherService;
    @Autowired
    private StudentService studentService;





    @RequestMapping(value = "test")
    public String testLogin(Model model) {
        //PersonalAssignmentAnswer answer = studentService.getAnswer("7","13211065");
        //model.addAttribute("teacher",answer);
        return "test";
    }

    //http://localhost:8080/downloadAttachment.do?is_teamwork=true&assignment_id=b5188078-4&student_id=13211064
    @RequestMapping(value = "downloadAttachment")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response){
        String isTeamwork = request.getParameter("is_teamwork");
        String aid = request.getParameter("assignment_id");
        String  id;
        if (isTeamwork=="true")
            id = request.getParameter("team_id");
        else
            id = request.getParameter("student_id");
        String resURL = request.getSession().getServletContext().getRealPath("/uploadFiles/assignment");
        resURL = resURL+"/"+aid+"/"+id;
        try {
            File file = new File(resURL);
            if (!file.exists()){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            String realname = file.list()[0];
            response.setHeader("content-disposition", "attachment;filename=" + URLEncoder.encode(realname, "UTF-8"));
            FileInputStream in = new FileInputStream(resURL+"/"+realname);
            OutputStream out = response.getOutputStream();
            byte buffer[] = new byte[1024];
            int len ;
            while((len=in.read(buffer))>0){
                out.write(buffer, 0, len);
            }
            in.close();
            out.close();
        }catch (IOException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
    }

}
