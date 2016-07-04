package controller;

import entity.BaseException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import service.StudentService;
import model.Student;


/**
 * Created by isiki on 2016/7/04.
 */

@Controller
public class LoginController {

    private static Logger logger = Logger
            .getLogger(LoginController.class);

    @Autowired
    private StudentService studentService;
    @Autowired
    private TeacherService teacherService;


    @RequestMapping(value = "login")
    public String userLogin(@ModelAttribute("user") User user, @ModelAttribute("errorInfo") String errorInfo,
                            @ModelAttribute("isAdmin") String isAdmin, Model model) throws BaseException {


    @RequestMapping(value = "findPasswordAction")
    public String findPasswordAction(int id,HttpServletRequest request,Model model) throws BaseException {
        String errorInfo="";
        String defaultPassword="";
        User user=userService.getUserById(id);
        if(user!=null){
            boolean result=GenerateLinkUtil.verifyCheckcode(String.valueOf(id), user.getRandomCode(),request);
            if(result){
                defaultPassword=GenerateLinkUtil.randomPassword();
                user.setPassword(EncryptionUtil.getMD5Str(defaultPassword));
                user.setRandomCode(GenerateLinkUtil.generateRandomCode());
                userService.updateUser(user);
            }
        }
        model.addAttribute("errorInfo","链接已失效");
        model.addAttribute("password",defaultPassword);
        return "find-password-action";
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
        request.getSession().removeAttribute(Constants.USER_INFO);
        return "redirect:login.do";
    }

    @RequestMapping(value = "layout_template")
    public String socialList() {
        taskService.getTaskUserNumberByMonth("2016-04");
        return "layout_template";
    }


    /**
     * @param user
     * @param result
     * @param model
     * @param request
     * @param redirectAttributes
     * @return
     */
    @RequestMapping(value = "login_action", method = RequestMethod.POST)
    public String loginAction(User user, BindingResult result, Model model,
                              HttpServletRequest request, RedirectAttributes redirectAttributes) {
        String errorInfo = "";
        if (!result.hasErrors()) {
            ArrayList<User> users = userService.getUserByProperty("username", user.getUsername());
            if (users.size() == 0) {
                errorInfo = "用户名不存在";
            } else {
                String encryptPassword = EncryptionUtil.getMD5Str(user.getPassword());
                if (users.get(0).getPassword().equals(encryptPassword)) {//密码匹配
                    request.getSession().setAttribute(entity.Constants.USER_INFO, users.get(0));
                    int role = users.get(0).getRole();
                    if (role == User.ADMIN || role == User.SUPER_ADMIN) {
                        //保存用户信息在session中
                        return "redirect:/admin/addtask.do";
                    } else {
                        return "redirect:/fill_in_work_hour.do";
                    }

                } else {
                    errorInfo = "用户名密码不匹配";
                }
            }
        } else {
            errorInfo = "用户名或密码格式错误";
        }


        //避免信息丢失，携带用户填写的信息重定向，原理是保存在session里面，刷新页面后就丢失
        redirectAttributes.addFlashAttribute("user", user);
        redirectAttributes.addFlashAttribute("errorInfo", errorInfo);
        return "redirect:/login.do";
    }
}

