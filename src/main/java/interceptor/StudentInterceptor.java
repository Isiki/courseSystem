package interceptor;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Mouze on 2016/7/6.
 */
public class StudentInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
        String authstr = (String)request.getSession().getAttribute("auth");
        if("student".equals(authstr)) return true;
        response.sendRedirect("/no_auth.html");
        return false;
    }
}
