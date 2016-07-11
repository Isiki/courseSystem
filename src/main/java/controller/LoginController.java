package controller;

import entity.BaseException;
import model.Admin;
import model.Student;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import service.LoginService;
import service.StudentService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


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

    @RequestMapping(value = "logout_action")
    public String logout(HttpSession session){
        session.removeAttribute("id");
        session.removeAttribute("userType");
        session.removeAttribute("course_id");
        session.removeAttribute("course_name");
        return "redirect:/login.do";
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
    public String loginAction(HttpServletRequest request,HttpSession session,
                              Model model)
    {
        boolean success = false;
        String redirect = "login.do";
        String username = (String)request.getParameter("username");
        String password_raw = (String)request.getParameter("password");
        String userType = (String)request.getParameter("usertype");

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


        System.out.equals("Login username " + username + " userType " + userType);

        if("admin".equals(userType))
        {
            Admin admin = service.LoginAsAdmin(username, password);
            success = (admin != null);
            if(success)
            {
                request.getSession().setAttribute("username", admin.getRealName());
                redirect = "a/course.do";
            }

        }

        if("student".equals(userType))
        {
            Student student = service.LoginAsStudent(username, password);
            success = (student!=null);
            if(success){
                request.getSession().setAttribute("username", student.getRealName());
                redirect = "s/workspace.do";
            }
        }

        if("teacher".equals(userType))
        {
            Teacher teacher = service.LoginAsTeacher(username, password);
            success = teacher!=null;
            if(success){
                request.getSession().setAttribute("username", teacher.getRealName());
                redirect = "t/workspace.do";
            }
        }

        if(success)
        {
            // TODO: UserSession as parameter
            // UserSession us = new UserSession(session);
            request.getSession().setAttribute("id", username);
            request.getSession().setAttribute("userType", userType);
        }

        return "redirect:"+redirect;
    }


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

