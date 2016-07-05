package controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.StudentService;
import model.Student;

/**
 * Created by tuomao on 2016/6/2.
 */
@Controller
public class SecurityTestController {
    @Autowired
    private StudentService studentService;
    @RequestMapping(value = "test")
    public String testLogin() {

        return "layout_template";
    }

}
