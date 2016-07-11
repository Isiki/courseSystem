package controller;

import model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import service.AssignmentAnswerService;
import service.FileService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * Created by ElaineC on 2016/7/8.
 */
@Controller
public class AssignmentAnswerController {
    @Autowired
    private AssignmentAnswerService assignmentAnswerService;
    private static final String answerRootPath="/uploadFiles/assignment";


    /*@RequestMapping(value = "searchpersonalassignmentanswer", method = RequestMethod.POST)
    public String searchPersonalAssignmentAnswer(@RequestParam("method") String meth, @RequestParam("value") String val, Model model) {
        if (meth.equals("ById")) {
            List<PersonalAssignmentAnswer> personalAssignmentAnswers = assignmentAnswerService.getPersonalAnswerByStudentId(val);
            model.addAttribute("personalassignmentanswers", personalAssignmentAnswers);
        } else if (meth.equals("ByCourse")) {
            List<PersonalAssignmentAnswer> personalAssignmentAnswers = assignmentAnswerService.getPersonalAnswerByCourseId(val);
            model.addAttribute("personalassignmentanswers", personalAssignmentAnswers);
        }
        return "searchresult";
    }*/

    @RequestMapping(value = "searchteamassignmentanswer", method = RequestMethod.POST)
    public String searchTeamAssignmentAnswer(@RequestParam("method") String meth, @RequestParam("value") String val, Model model) {
        if (meth.equals("ById")) {
            List<TeamAssignmentAnswer> teamAssignmentAnswers = assignmentAnswerService.getTeamAnswerByTeamId(val);
            model.addAttribute("teamassignmentanswers", teamAssignmentAnswers);
        } else if (meth.equals("ByCourse")) {
            List<TeamAssignmentAnswer> teamAssignmentAnswers = assignmentAnswerService.getTeamAnswerByCourseId(val);
            model.addAttribute("teamassignmentanswers", teamAssignmentAnswers);
        }
        return "searchresult";
    }

    @RequestMapping(value = "t/check_assignment", method = RequestMethod.GET)
    public String getAnswerByAssignmentId(String assignmentId, String teamType, String userId, Model model) {
        if ("team" == teamType) {
            TeamAssignmentAnswerPK pk = new TeamAssignmentAnswerPK();
            pk.setAssignmentId(assignmentId);
            pk.setTeamId(userId);
            model.addAttribute("assignAnsDetail", assignmentAnswerService.getTeamAnswerByPK(pk));
        } else {
            PersonalAssignmentAnswerPK pk = new PersonalAssignmentAnswerPK();
            pk.setAssignmentId(assignmentId);
            pk.setStudentId(userId);
            model.addAttribute("assignAnsDetail", assignmentAnswerService.getPersonalAnswerByPK(pk));
        }
        return "assignAnsDetail";
    }

    @RequestMapping(value = "t/check_team_assignment", method = RequestMethod.POST)
    @ResponseBody
    public String commentTeamAssignment(String assignment_id,String team_id,String comment,String grade){
        TeamAssignmentAnswerPK pk= new TeamAssignmentAnswerPK();
        pk.setAssignmentId(assignment_id);
        pk.setTeamId(team_id);
        TeamAssignmentAnswer answer=assignmentAnswerService.getTeamAnswerByPK(pk);
        answer.setComment(comment);
        answer.setGrade(Integer.parseInt(grade));
        assignmentAnswerService.commentAssignment(answer);
        return "success";
    }
    
    @RequestMapping(value = "t/check_personal_assignment", method = RequestMethod.POST)
    @ResponseBody
    public String commentPersonalAssignment(String assignment_id,String student_id,String comment,String grade){
        PersonalAssignmentAnswerPK pk=new PersonalAssignmentAnswerPK();
        pk.setAssignmentId(assignment_id);
        pk.setStudentId(student_id);
        PersonalAssignmentAnswer answer=assignmentAnswerService.getPersonalAnswerByPK(pk);
        answer.setComment(comment);
        answer.setGrade(Integer.parseInt(grade));
        assignmentAnswerService.commentAssignment(answer);
        return "success";
    }

    @Autowired
    private FileService fileService;

    @RequestMapping(value = {"t/downloadAnswer", "s/downloadAnswer"})
    public void downloadFile(HttpServletRequest request, HttpServletResponse response){
        String assId = request.getParameter("ass_id");
        String subCataId = request.getParameter("sub_cata_id");
        String path = request.getSession().getServletContext().getRealPath(answerRootPath + "/" + assId + "/" + subCataId);
        List<File> files = fileService.getAllFiles(path);
        if(files.size() <= 0 || files.size() >= 2) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        File file = files.get(0);
        String filename = file.getName();
        String fullpath = request.getSession().getServletContext().getRealPath(path + "/" + filename);
        try {
            response.setHeader("content-disposition", "attachment;filename=" + URLEncoder.encode(filename, "UTF-8"));
            FileInputStream in = new FileInputStream(fullpath);
            OutputStream out = response.getOutputStream();
            byte buffer[] = new byte[1024];
            int len;
            while((len=in.read(buffer))>0){
                out.write(buffer, 0, len);
            }
            in.close();
            out.close();
        }catch (Exception e){
            e.printStackTrace();
        }

    }



}
