package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.FileService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.io.PrintWriter;
import java.util.List;


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
        List<File> files = fileService.getAllFiles(resURL);
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
            String uploadFilesJson = fileService.saveFile(request, resURL);

            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.setStatus(HttpServletResponse.SC_OK);
            respWriter = response.getWriter();
            respWriter.append(uploadFilesJson);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }finally {
            if (respWriter != null)
                respWriter.close();
        }
    }

    @RequestMapping(value = "downloadFile")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response, Model model)
            throws ServletException,IOException{
        String url = request.getParameter("url");
        File file = new File(url);
        if(!file.exists()){
            model.addAttribute("message","未知错误，文件不存在");
            return;
        }
        String realname = url;
        //设置响应头，控制浏览器下载该文件
        response.setHeader("content-disposition", "attachment;filename=" + URLEncoder.encode(realname, "UTF-8"));
        //读取要下载的文件，保存到文件输入流
        FileInputStream in = new FileInputStream(url);
        //创建输出流
        OutputStream out = response.getOutputStream();
        //创建缓冲区
        byte buffer[] = new byte[1024];
        int len = 0;
        //循环将输入流中的内容读取到缓冲区当中
        while((len=in.read(buffer))>0){
            //输出缓冲区的内容到浏览器，实现文件下载
            out.write(buffer, 0, len);
        }
        //关闭文件输入流
        in.close();
        //关闭输出流
        out.close();
    }

}
