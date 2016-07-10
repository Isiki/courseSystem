package controller;

import dao.StudentDao;
import entity.BaseException;
import org.aspectj.bridge.Message;
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
import util.UserSession;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;


/**
 * Created by isiki on 2016/7/04.
 */

@Controller
public class LoginController {

    @Autowired
    private StudentService studentService;

    // TODO: UserSession as parameter
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

    /*
    @RequestMapping(value = "login_action", method = RequestMethod.POST)
    public String loginAction(HttpServletRequest request,
                              Model model)
    {
        boolean success = false;
        String redirect = "login.do";
        String username = (String)request.getParameter("username");
        String password_raw = (String)request.getParameter("password");
        String authtype = (String)request.getParameter("authtype");

        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        try {
            md.update(password_raw.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        byte[] bts = md.digest();
        String password = new String(encodeHex(bts));


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
            if(success) redirect = "teacher/add_assignment.do?courseId=1";
        }

        if(success)
        {
            // TODO: UserSession as parameter
            //UserSession us = new UserSession();

            request.getSession().setAttribute("id", username);
            request.getSession().setAttribute("auth", authtype);
        }

        return "redirect:"+redirect;
    }
    */

    private static final char[] DIGITS = { '0', '1', '2', '3', '4', '5', '6',
            '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
    private static char[] encodeHex(byte[] data) {
        int l = data.length;

        char[] out = new char[l << 1];

        int i = 0;
        for (int j = 0; i < l; ++i) {
            out[(j++)] = DIGITS[((0xF0 & data[i]) >>> 4)];
            out[(j++)] = DIGITS[(0xF & data[i])];
        }

        return out;
    }


}

