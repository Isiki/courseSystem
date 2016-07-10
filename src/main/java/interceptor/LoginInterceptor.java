package interceptor;
/*
import dao.UserDao;
import entity.Constants;
import model.User;
*/
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Constants;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
//import service.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
/**
 * Created by isiki on 2016/7/3.
 */
public class LoginInterceptor implements  HandlerInterceptor {
    private List<String> excludeUrls;
    public void setExcludeUrls(List<String> excludeUrls) {
        this.excludeUrls = excludeUrls;
    }

    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        boolean flag=false;
        String url=httpServletRequest.getRequestURL().toString();
        for(String s:excludeUrls){
            if(url.contains(s)){
                flag=true;
            }
        }

        if(!flag) {
            String user = (String)httpServletRequest.getSession().getAttribute("id");
            // TODO 为了方便开发和调试，直接添加管理员
            //User user = (User) httpServletRequest.getSession().getAttribute(Constants.USER_INFO);
//            User user=userService.getUserById(4);
//            httpServletRequest.getSession().setAttribute(Constants.USER_INFO,user);
            //String user = "isiki" ;  //user not defined, delete later
            if(user!=null) {
                flag = true;
            }else{
                httpServletResponse.sendRedirect(httpServletRequest.getContextPath()+"/login.do");
            }
        }
        return flag;
    }
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
