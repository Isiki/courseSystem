package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.CourseService;
import service.StudentService;
import service.TeacherService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Mouze on 2016/7/10.
 */
@Controller
@RequestMapping(value = "a")
public class AdminViewController {

    @Autowired
    CourseService courseService;
    @Autowired
    TeacherService teacherService;
    @Autowired
    StudentService studentService;

    @RequestMapping(value = "course", method = RequestMethod.GET)
    public String showCourses(Model model){
        model.addAttribute("courses", courseService.getAllCourses());
        return "course_front";
    }

    @RequestMapping(value = "course_detail", method = RequestMethod.GET)
    public String showCourseDetail(@RequestParam("course_id") String course_id,
                                   Model model)
    {
        model.addAttribute("course", courseService.getCourseById(course_id));
        model.addAttribute("teachersIn", courseService.getTeachers(course_id));
        model.addAttribute("studentsIn", courseService.getStudents(course_id));
        return "course_detail";
    }

    @RequestMapping(value = "teacher", method = RequestMethod.GET)
    public String showTeachers(Model model){
        model.addAttribute("teachers", teacherService.getAllTeachers());
        return "teacher_front";
    }

    @RequestMapping(value = "teacher_detail", method = RequestMethod.GET)
    public String showTeacherDetail(@RequestParam("teacher_id") String teacher_id,
                                    Model model)
    {
        model.addAttribute("teacher", teacherService.getTeacherById(teacher_id));
        model.addAttribute("coursesIn", teacherService.getCourses(teacher_id));
        return "teacher_detail";
    }

    @RequestMapping(value = "student", method = RequestMethod.GET)
    public String showStudents(Model model)
    {
        model.addAttribute("students", studentService.getAllStudents());
        return "student_front";
    }

    @RequestMapping(value = "student_detail", method = RequestMethod.GET)
    public String showStudentDetail(@RequestParam("student_id") String student_id,
                                    Model model){
        model.addAttribute("student", studentService.getStudentById(student_id));
        model.addAttribute("coursesIn", studentService.getAllCourseById(student_id));
        return "student_detail";
    }

}
