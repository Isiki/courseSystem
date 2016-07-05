package controller;

import model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.CourseService;
import org.springframework.ui.Model;

import javax.validation.Constraint;

/**
 * Created by ElaineC on 2016/7/4.
 */
@Controller
public class CourseController {

    @Autowired
    private CourseService courseService;

    @RequestMapping(value = "addcourse", method = RequestMethod.POST)
    public String addCourseInfo(@RequestParam("courseid") int id,
                                @RequestParam("coursename") String name,
                                @RequestParam("techerid") int teacher,
                                @RequestParam("description") String desc,
                                Model model) {
        String result = courseService.addCourse(name, id, teacher, desc);
        model.addAttribute("result", result);
        return "addresult";
    }


    @RequestMapping(value = "searchcourse", method = RequestMethod.POST)
    public String searchCourse(@RequestParam("value") String val,
                               @RequestParam("method") String meth,
                               Model model) {
        Course course = null;
        if (meth == "ById")
            course = courseService.searchCourseById(Integer.parseInt(val));
        else if (meth == "ByName")
            course = courseService.searchCourseByName(val);
        else if (meth == "ByTeacherName")
            course = courseService.searchCourseByTeacherName(val);

        model.addAttribute("course", course);
        return "searchresult";
    }


    @RequestMapping(value = "deletecourse", method = RequestMethod.POST)
    public String deleteCourseInfo(@RequestParam("courseid") int id, Model model) {
        String result = courseService.deleteCourse(id);
        model.addAttribute("result", result);
        return "deleteresult";
    }


    @RequestMapping(value = "editcourse", method = RequestMethod.POST)
    public String editCourseInfo(@RequestParam("courseid")      int id,
                                  @RequestParam("coursename")   String name,
                                  @RequestParam("techerid")     int teacher,
                                  @RequestParam("coursedes")    String des,
                                  Model model) {
        boolean success = true;
        if(name!="")    success &= (courseService.editCourseName(id, name)=="success");
        if(teacher>0)   success &= (courseService.editCourseTeacher(id, teacher)=="success");
        if(des!="")     success &= (courseService.editCourseDescription(id, des)=="success");
        model.addAttribute("result", success?"success":"fail");
        return "editresult";
    }


}
