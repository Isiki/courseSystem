package controller;

import model.Course;
import model.Student;
import model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import service.CourseService;
import org.springframework.ui.Model;

import javax.validation.Constraint;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ElaineC on 2016/7/4.
 */
@Controller
@RequestMapping("/admin")
public class CourseController {

    /*
    Mapping
    {
        searchcourse    >   search by id/cname/tname
        editcourse      >   update course information
        course          >   simply show all
    }
     */


    @Autowired
    private CourseService courseService;

    @RequestMapping(value = "searchcourse", method = RequestMethod.GET)
    public String searchCourse(@RequestParam("value") String val,
                               @RequestParam("method") String meth,
                               Model model) {
        System.out.println(val);

        Course course = null;
        if (meth.equals("ById"))
            course = courseService.searchCourseById(val);
        else if (meth.equals("ByName"))
            course = courseService.searchCourseByName(val);
        else if (meth.equals("ByTeacherName"))
            course = courseService.searchCourseByTeacherName(val);

        if(course != null)
        {
            List<Course> courses = new ArrayList<Course>();
            courses.add(course);
            model.addAttribute("courses", courses);
        }

        return "course_front";
    }

    @RequestMapping(value="testxx")
    public String showAll(Model model){
        List<Course> courses = courseService.getAllCourses();
        model.addAttribute("courses", courses);
        return "course_front";
    }


    @RequestMapping(value="showdetail", method = RequestMethod.GET)
    public String showDetail(@RequestParam("id") String id, Model model){
        Course course = courseService.searchCourseById(id);
        if(course == null)
            return "error";

        List<Teacher> teachers = courseService.getTeachers(course.getId());
        List<Student> students = courseService.getStudents(course.getId());

        model.addAttribute("course", course);
        if(teachers.get(0) != null) model.addAttribute("teachers", teachers);
        if(students.get(0) != null) model.addAttribute("students", students);

        System.out.println(teachers);
        System.out.println(students);

        return "course_detail";
    }
}
