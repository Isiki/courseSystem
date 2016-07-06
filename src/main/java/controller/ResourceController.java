package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import service.FileService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;


/**
 * Created by isiki on 2016/7/5.
 */
@Controller
public class ResourceController {

    @RequestMapping(value = "resource")
    public String resouceManage()
    {
        return "resource";
    }

    @RequestMapping(value = "show_resource")
    public void showResource(HttpServletRequest request, HttpServletResponse response){
        String resURL = request.getSession().getServletContext().getRealPath("/uploadFiles/resource");
        File[] files = fileService.getAllFiles(resURL);
        String json = fileService.filesToJson(files);

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);
        PrintWriter respWriter=null;
        try {
            respWriter = response.getWriter();
            respWriter.append(json);
        } catch(IOException e) {
            e.printStackTrace();
        }finally {
            if (respWriter != null)
                respWriter.close();
        }
    }

    @Autowired
    private FileService fileService;

    @RequestMapping(value = "saveResource_action")
    public void saveResource(HttpServletRequest request, HttpServletResponse response){
        PrintWriter respWriter=null;
        try {
            String resURL = request.getSession().getServletContext().getRealPath("/uploadFiles/resource");
            File uploadFiles = fileService.saveFile(request, resURL);

            File[] files = fileService.getAllFiles(resURL);
            String json = fileService.filesToJson(files);

            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.setStatus(HttpServletResponse.SC_OK);

            respWriter = response.getWriter();
            respWriter.append(json);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }finally {
            if (respWriter != null)
                respWriter.close();
        }
    }



}
