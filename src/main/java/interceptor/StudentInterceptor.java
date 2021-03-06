package interceptor;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import util.UserSession;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Mouze on 2016/7/6.
 */
public class StudentInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
        UserSession userSession=new UserSession(request.getSession());
        String authstr = (String)userSession.getUserType();
        if("student".equals(authstr)) return true;
        response.sendRedirect("/no_auth.html");
        return false;
    }
}
