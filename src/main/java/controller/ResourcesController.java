package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import service.ResourcesService;
import util.FileValidator;

/**
 * Created by isiki on 2016/7/5.
 */
@Controller
public class ResourcesController {
    @Autowired
    private ResourcesService resourcesService;





}






