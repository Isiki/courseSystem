package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.StudentService;
import model.Student;
import service.TeacherService;


/**
 * Created by isiki on 2016/7/04.
 */

@Controller
public class LoginController {

    private static Logger logger = Logger
            .getLogger(LoginController.class);

    @Autowired
    private StudentService studentService;


    @RequestMapping(value = "login")
    public String userLogin(@ModelAttribute("user") String user, @ModelAttribute("errorInfo") String errorInfo,
                            @ModelAttribute("isAdmin") String isAdmin, Model model) throws BaseException {
        return "login";
    }


    @RequestMapping(value = "find_password")
    public String findPassword(Model model)  {
        return "find_password";
    }


    @RequestMapping(value = "error")
    public String error(){
        return "error";
    }

    @RequestMapping(value = "logout")
    public String logout(HttpServletRequest request) {

        return "redirect:login.do";
    }

    @RequestMapping(value = "layout_template")
    public String socialList() {

        return "layout_template";
    }



}

