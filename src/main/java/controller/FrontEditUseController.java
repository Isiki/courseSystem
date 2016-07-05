package controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

/**
 * Created by Mouze on 2016/7/4.
 */
@Controller
public class FrontEditUseController {
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
}

