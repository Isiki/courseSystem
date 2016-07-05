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
import java.util.List;

/**
 * Created by ElaineC on 2016/7/4.
 */
@Controller
public class CourseController {

    @Autowired
    private CourseService courseService;
/*
    @RequestMapping(value = "addcourse", method = RequestMethod.GET)
    public String addCourseInfo(@RequestParam("courseid") int id,
                                @RequestParam("coursename") String name,
                                @RequestParam("techerid") int teacher,
                                @RequestParam("description") String desc,
                                Model model) {
            //String result = courseService.addCourse(name, teacher, desc);
        //model.addAttribute("result", result);
        return "addresult";
    }


    @RequestMapping(value = "searchcourse", method = RequestMethod.GET)
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


    @RequestMapping(value = "deletecourse", method = RequestMethod.GET)
    public String deleteCourseInfo(@RequestParam("courseid") int id, Model model) {
        String result = courseService.deleteCourse(id);
        model.addAttribute("result", result);
        return "deleteresult";
    }

*/

    @RequestMapping(value = "editcourse", method = RequestMethod.GET)
    public String editCourseInfo(@RequestParam("id") String id,
                                  @RequestParam("course_name") String cname){
        String res = courseService.editCourseName(id, cname);
        System.out.println("course_name: "+cname);
        return "error";
    }

    @RequestMapping(value="coursetable")
    public String giveYouAll(Model model){
        List<Course> course=courseService.getAllCourses();
        model.addAttribute("courses",course);
        return "course_front";
    }

}
