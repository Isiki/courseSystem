package util;

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
        session.setAttribute("userSession", user);
        session.setMaxInactiveInterval(60*40);
    }

    public Teacher getCurrentUser(){
        Teacher user = (Teacher)session.getAttribute("userSession");
        if(user == null){
            System.out.println("Session is null!");
            return null;
        }
        return user;
    }
}
