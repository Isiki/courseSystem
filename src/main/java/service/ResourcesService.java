package service;

import entity.BaseException;
import model.Resources;

import java.util.ArrayList;

/**
 * Created by isiki on 2016/7/5.
 */
public interface ResourcesService {

    Resources getResourcesById(int id);
    ArrayList<Resources> getResourcesByCourse(int courseId);
    ArrayList<Resources> getAll();
    void insertResources(Resources resources) throws BaseException;
    void updateResources(Resources resources) throws BaseException;
    void deleteById(int id)throws BaseException;

}
