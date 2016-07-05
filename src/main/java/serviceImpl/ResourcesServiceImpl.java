package serviceImpl;

import dao.ResourcesDao;
import entity.BaseException;
import model.Resources;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import service.ResourcesService;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/5.
 */
@Service
public class ResourcesServiceImpl implements ResourcesService {
    @Autowired
    private ResourcesDao resourcesDao;
    public ArrayList<Resources> getAll() {
        return resourcesDao.getAll();
    }

    public Resources getResourcesById(int id) {
        return resourcesDao.getResourcesById(id);
    }

    public void insertResources(Resources resources) throws BaseException{
        resourcesDao.insertResources(resources);
    }

    public void updateResources(Resources resources) {
        resourcesDao.updateResources(resources);
    }

    public ArrayList<Resources> getResourcesByCourse(int courseId) {
        return resourcesDao.getResourcesByCourse(courseId);
    }

    public void deleteById(int id) throws BaseException {
        resourcesDao.deleteById(id);
    }
}
