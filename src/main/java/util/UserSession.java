package util;

import model.Admin;
import model.Course;
import model.Student;
import model.Teacher;

import javax.servlet.http.HttpSession;

/**
 * Created by andyz_000 on 2016/7/4.
 */
public class UserSession {
    private HttpSession session;

    public UserSession(HttpSession session){
        this.session = session;
    }


    public void setCurrentUser(Teacher user){
        session.setAttribute("userId", user.getId());
        session.setAttribute("userName",user.getRealName());
        session.setAttribute("userType","teacher");
    }

    public void setCurrentUser(Student user){
        session.setAttribute("userId", user.getId());
        session.setAttribute("userName",user.getRealName());
        session.setAttribute("userType","student");
    }

    public void setCurrentUser(Admin user){
        session.setAttribute("userId", user.getId());
        session.setAttribute("userName",user.getRealName());
        session.setAttribute("userType","admin");
    }

    public void setCurrentCourse(Course course){
        session.setAttribute("course",course);
    }

    public Course getCourse(){
        Course course=(Course)session.getAttribute("course");
        if(null!=course){
            return course;
        }else{
            return null;
        }
    }
    public String getUserId(){
        String userid=(String)session.getAttribute("userId");
        if(null==userid){
            System.out.println("userId not set!");
            return "";
        }
        return userid;
    }

    public String getUserName(){
        String username=(String)session.getAttribute("userName");
        if(null==username){
            System.out.println("userId not set!");
            return "";
        }
        return username;
    }

    public String getUserType(){
        String usertype=(String)session.getAttribute("userType");
        if(null==usertype){
            System.out.println("usertype not set!");
            return "";
        }
        return usertype;
    }
}
