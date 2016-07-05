package dao;

import model.Resources;

import java.util.ArrayList;


/**
 * Created by isiki on 2016/7/4.
 */
public interface ResourcesDao {
    ArrayList<Resources> getAll();
    Resources getResourcesById(int id);
    void insertResources(Resources resources);
    void updateResources(Resources resources);
    ArrayList<Resources> getResourcesByCourse(int courseId);
    void deleteById(int id);
}
