package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.StudentService;
import model.Student;
import service.TeacherService;

/**
 * Created by isiki on 2016/7/3.
 */
@Controller
public class LoginController {
    @Autowired
    private StudentService studentService;
    @Autowired
    private TeacherService teacherService;
    @RequestMapping(value = "login")
    public String login(Model model){
        Student student = studentService.getStudentById("13211035");
        model.addAttribute("student",teacherService.teacherLogin("06091"));
        System.out.println(student.getRealName());

        return "login";

    }
}

