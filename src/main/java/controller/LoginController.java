package controller;

import dao.StudentDao;
import entity.BaseException;
import model.Admin;
import model.Teacher;
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
import javax.servlet.http.HttpSession;
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
    public String loginAction(HttpServletRequest request, HttpSession session,
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
        UserSession user=new UserSession(session);

        System.out.equals("Login username " + username + " authtype " + authtype);

        if("admin".equals(authtype))
        {
            Admin admin =service.LoginAsAdmin(username, password);
            if(null!=admin)
            {
                user.setCurrentUser(admin);
                redirect = "admin/course.do";
            }
        }

        if("student".equals(authtype))
        {
            Student student = service.LoginAsStudent(username, password);
            if(null!=student){
                user.setCurrentUser(student);
                redirect = "student/course.do";
            }
        }

        if("teacher".equals(authtype))
        {
            Teacher teacher = service.LoginAsTeacher(username, password);
            if(null!=teacher){
                user.setCurrentUser(teacher);
                redirect = "teacher/add_assignment.do?courseId=1";
            }
        }

        if(null!=user.getUserId())
        {
            /*request.getSession().setAttribute("id", username);*/
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

