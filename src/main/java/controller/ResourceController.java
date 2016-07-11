package controller;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import service.FileService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;


/**
 * Created by isiki on 2016/7/5.
 */
@Controller
public class ResourceController {

    private static final String resRootPath = "/uploadFiles/resource";
    private String resCoursePath = resRootPath;

    @Autowired
    private FileService fileService;

    @RequestMapping(value = "resource")
    public String resouceManage()
    {
        return "resource";
    }

    private void setResRootPath(HttpServletRequest request) {
        resCoursePath += request.getSession().getAttribute("course_id").toString();
    }

    @RequestMapping(value = "show_resource")
    public void showResource(HttpServletRequest request, HttpServletResponse response){
         String resURL = request.getSession().getServletContext().getRealPath(resRootPath + request.getParameter("path"));
        List<File> files = fileService.getAllFiles(resURL);
        String json = fileService.filesToJson(files);

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);
        handleResponse(response, json);
    }

    @RequestMapping(value = "saveResource_action")
    public void saveResource(HttpServletRequest request, HttpServletResponse response){
        PrintWriter respWriter=null;
        try {
            String resURL = request.getSession().getServletContext().getRealPath(resRootPath);
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

    @RequestMapping(value = "downloadResource")
    public void downloadResource(HttpServletRequest request, HttpServletResponse response)
    {
        String path = request.getParameter("path");
        String filename = request.getParameter("filename");
        String filepath = request.getSession().getServletContext().getRealPath(resRootPath) + path + filename;

        File file = new File(filepath);
        if(!file.exists()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        try {
            //设置响应头，控制浏览器下载该文件
            response.setHeader("content-disposition", "attachment;filename=" + URLEncoder.encode(filename, "UTF-8"));
            //读取要下载的文件，保存到文件输入流
            FileInputStream in = new FileInputStream(filepath);
            //创建输出流
            OutputStream out = response.getOutputStream();
            //创建缓冲区
            byte buffer[] = new byte[1024];
            int len = 0;
            //循环将输入流中的内容读取到缓冲区当中
            while ((len = in.read(buffer)) > 0) {
                //输出缓冲区的内容到浏览器，实现文件下载
                out.write(buffer, 0, len);
            }
            //关闭文件输入流
            in.close();
            //关闭输出流
            out.close();
        } catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "show_resTree")
    public void showResTree(HttpServletRequest request, HttpServletResponse response)
    {
        String rootPath = request.getSession().getServletContext().getRealPath(resRootPath);
        String resTreeJson = fileService.getDirStructionJson(rootPath);

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);
        handleResponse(response, resTreeJson);
    }

    private void handleResponse(HttpServletResponse response, String content)
    {
        PrintWriter respWriter = null;
        try {
            respWriter = response.getWriter();
            respWriter.append(content);
        } catch(IOException e) {
            e.printStackTrace();
        }finally {
            if (respWriter != null)
                respWriter.close();
        }
    }

    @RequestMapping(value = "moveFile")
    public void moveFile(HttpServletRequest request, HttpServletResponse response)
    {
        String src = request.getSession().getServletContext().getRealPath(resRootPath+request.getParameter("source"));
        String dst = request.getSession().getServletContext().getRealPath(resRootPath+request.getParameter("destination"));
        try {
            Path sourcePath = Paths.get(src);
            Path destinationPath = Paths.get(dst);
            Files.move(sourcePath, destinationPath, StandardCopyOption.REPLACE_EXISTING);
        }catch (IOException e)
        {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @RequestMapping(value = "removeFile")
    public void removeFile(HttpServletRequest request, HttpServletResponse response)
    {
        String filePath = null;
        try {
            String path = request.getParameter("path");
            filePath = request.getSession().getServletContext().getRealPath(resRootPath + path);
            Path fileToBeDel = Paths.get(filePath);

            Files.deleteIfExists(fileToBeDel);
            response.setStatus(HttpServletResponse.SC_OK);
        }catch(Exception e) {
            e.printStackTrace();
            //FileUtils.deleteQuietly(new File(filePath));
        }
    }

    @RequestMapping(value = "newFolder")
    public void newFolder(HttpServletRequest request, HttpServletResponse response)
    {
        String path = request.getParameter("path");
        String folderName = request.getParameter("folderName");
        try {
            String folderPath = request.getSession().getServletContext().getRealPath(resRootPath + path + folderName);
            File folder = new File(folderPath);
            if(folder.exists())
            {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            folder.mkdirs();
            response.setStatus(HttpServletResponse.SC_OK);
        }catch(Exception e) {
            e.printStackTrace();
        }
    }
}
