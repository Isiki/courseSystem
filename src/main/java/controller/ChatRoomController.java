package controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

import static java.lang.Math.max;

/**
 * Created by Admin on 2016/7/12.
 */
@Controller
@RequestMapping(value={"s","t"})
public class ChatRoomController {

    private static final String chatroomRootPath = "/chatroom/";

    @RequestMapping(value = "chatroom")
    public String chatRoom(HttpServletRequest request)
    {
        String courseId = request.getSession().getAttribute("course_id").toString();
        String fullpath = request.getSession().getServletContext().getRealPath(chatroomRootPath+courseId+".txt");
        File chatfile = new File(fullpath);
        try {
            if(!chatfile.exists())
            {
                chatfile.createNewFile();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "chatroom";
    }

    @RequestMapping(value = "refresh_chatroom")
    public void refreshChatRoom(HttpServletRequest request, HttpServletResponse response)
    {
        String courseId = request.getSession().getAttribute("course_id").toString();
        String fullpath = request.getSession().getServletContext().getRealPath(chatroomRootPath+courseId+".txt");
        File chatfile = new File(fullpath);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/text; charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);
        PrintWriter respWriter = null;
        try {
            respWriter = response.getWriter();
            LineNumberReader reader = new LineNumberReader(new FileReader(chatfile));

            String strLine = reader.readLine();

            while (strLine != null) {
                respWriter.append(strLine);
                strLine = reader.readLine();
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (respWriter != null)
                respWriter.close();
        }
    }

    @RequestMapping(value = "chat")
    public void chat(HttpServletRequest request, HttpServletResponse response)
    {
        String courseId = request.getSession().getAttribute("course_id").toString();
        String fullpath = request.getSession().getServletContext().getRealPath(chatroomRootPath+courseId+".txt");
        String stuName = request.getSession().getAttribute("username").toString();
        File chatfile = new File(fullpath);
        String msg = request.getParameter("msg");
        try {
            FileWriter writer = new FileWriter(chatfile, true);
            writer.write(stuName+": "+msg+"<br/>");
            writer.close();
        }catch (Exception e) {
            e.printStackTrace();
        }
    }
}
