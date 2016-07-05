package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import service.FileService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;


/**
 * Created by isiki on 2016/7/5.
 */
@Controller
public class ResourceController {
    @RequestMapping(value = "resource")
    public String resouceManage(){
        return "resource";
    }

    @Autowired
    private FileService fileService;

    @RequestMapping(value = "saveResource_action")
    public void saveResource(HttpServletRequest request, HttpServletResponse response){
        try {
            File uploadFiles = fileService.saveFile(request, request.getSession().getServletContext().getRealPath("/"));

            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }



}
