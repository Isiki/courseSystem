package controller;

import dao.StudentDao;
import entity.BaseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.LoginService;
import service.StudentService;
import model.Student;
import service.TeacherService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


/**
 * Created by isiki on 2016/7/04.
 */

@Controller
public class LoginController {

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

    @Autowired
    private LoginService service;

    @RequestMapping(value = "login_action", method = RequestMethod.POST)
    public String loginAction(HttpServletRequest request,
                              Model model)
    {
        boolean success = false;
        String redirect = "login";
        String username = (String)request.getParameter("username");
        String password = (String)request.getParameter("password");
        String authtype = (String)request.getParameter("authtype");

        System.out.equals("Login username " + username + " authtype " + authtype);

        if("admin".equals(authtype))
        {
            success = service.LoginAsAdmin(username, password);
            if(success)
            {
                redirect = "admin/course.do";
            }
        }

        if("student".equals(authtype))
        {
            success = service.LoginAsStudent(username, password);
            if(success) redirect = "student/course.do";
        }

        if("teacher".equals(authtype))
        {
            success = service.LoginAsTeacher(username, password);
            if(success) redirect = "teacher/course.do";
        }

        if(success)
        {
            request.getSession().setAttribute("id", username);
            request.getSession().setAttribute("auth", authtype);
        }

        return "redirect:"+redirect;
    }



}

