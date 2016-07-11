package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import service.FileService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.*;

/**
 * Created by Mouze on 2016/7/4.
 */
@Controller
public class FrontEditUseController {

    @Autowired
    private FileService fileService;

    @RequestMapping(value = "view", method = RequestMethod.GET)
    public String viewFront(@RequestParam("p") String page)
    {
        return page;
    }

    @RequestMapping(value = "view_table", method=RequestMethod.GET)
    public String viewTable(@RequestParam("p") String page, Model model){
        ArrayList lst = new ArrayList();
        for(int i=0;i<10;i++) lst.add(i);
        model.addAttribute("plaintext", "this is a piece of plain text.");
        model.addAttribute("intList", lst);
        return page;
    }

    @RequestMapping(value = "view_ue", method = RequestMethod.GET)
    public String viewUEditor()
    {
        return "assignment/ueditor_test";
    }

    @RequestMapping(value = "ue_submit_test", method = RequestMethod.POST)
    public void acceptSubmission(HttpServletRequest request, HttpServletResponse response)
    {
        // REMINDER: String resURL = request.getSession().getServletContext().getRealPath("/uploadFiles/resource");
        String htmlText = request.getParameter("content");
        System.out.println(htmlText);

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @RequestMapping(value = "assignment_upload", method = RequestMethod.POST)
    public void upload(HttpServletRequest request, HttpServletResponse response){
        PrintWriter respWriter=null;
        try {
            String resURL = request.getSession().getServletContext().getRealPath("/uploadFiles/assignment");
            fileService.saveFile(request, resURL);

            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.setStatus(HttpServletResponse.SC_OK);

            respWriter = response.getWriter();
            //respWriter.append();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }finally {
            if (respWriter != null)
                respWriter.close();
        }
    }

    //@RequestMapping(value = "assignment_download", method = RequestMethod.POST)
    // do not match assignment_download, just POST to "downloadFile.do"
}

