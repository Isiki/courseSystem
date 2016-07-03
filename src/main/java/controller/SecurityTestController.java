package controller;


import model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.StudentService;


/**
 * Created by tuomao on 2016/6/2.
 */
@Controller
public class SecurityTestController {
    @Autowired
    private StudentService studentService;
    @RequestMapping(value = "test_login")
    public String testLogin(String id, Model model) {
        Student student = studentService.getStudentById(id);
        System.out.print(student.getId());
        System.out.println(student.getName());
        model.addAttribute("student", student);
        return "test";
    }
}
