package controller;


import model.Course;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.CourseService;
import service.StudentService;
import service.TeacherService;

/**
 * Created by tuomao on 2016/6/2.
 */
@Controller
public class SecurityTestController {
    @Autowired
    private TeacherService teacherService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private CourseService courseService;




    @RequestMapping(value = "test")
    public String testLogin(Model model) {
        Teacher teacher = teacherService.getTeacherById("06091");
        model.addAttribute("teacher",teacher);

        Course course = courseService.searchCourseById("1");
        model.addAttribute("course",course);
        return "test";
    }

}
