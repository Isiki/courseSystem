package controller;

import model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.StudentService;
import util.PageResultSet;

import java.util.ArrayList;

/**
 * Created by Admin on 2016/7/5.
 */
@Controller
public class StudentController {
    @Autowired
    private StudentService studentService;

    @RequestMapping(value = "course")
    public String ListCourse(String id, Model model){
        ArrayList<String> course = studentService.getAllCourseById(id);
        PageResultSet<String> cources = new PageResultSet<>();
        cources.setList(course);
        model.addAttribute("courses",cources);
        return "course";
    }


}
