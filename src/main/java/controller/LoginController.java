package controller;

import model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.StudentService;

/**
 * Created by isiki on 2016/7/3.
 */
@Controller
public class LoginController {
    @Autowired
    private StudentService studentService;

    @RequestMapping(value = "login")
    public String login(Model model){
        Student student = studentService.getStudentById("13211064");
        model.addAttribute("student",student);
        return "login";
    }
}
