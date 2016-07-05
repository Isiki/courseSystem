package daoImpl;

import dao.ResourcesDao;
import model.Resources;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.mapping.Array;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;


/**
 * Created by isiki on 2016/7/4.
 */
@Repository("ResourcesDao")
public class ResourcesDaoImpl implements ResourcesDao {
    @Autowired
    private SessionFactory sessionFactory;

    public ArrayList<Resources> getAll() {
        String hql = "from Resources";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        ArrayList<Resources> resources = (ArrayList<Resources>) query.list();
        if (resources==null)
            resources = new ArrayList<Resources>();
        return resources;
    }

    public Resources getResourcesById(int id) {
        Resources resources = (Resources) sessionFactory.getCurrentSession().get(Resources.class,id);
        return resources;
    }

    public void insertResources(Resources resources) {
        sessionFactory.getCurrentSession().persist(resources);
    }

    public void updateResources(Resources resources){
        sessionFactory.getCurrentSession().update(resources);
    }



    public ArrayList<Resources> getResourcesByCourse(int courseId) {
        String hql = "from Resources r where r.course.id = ?";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        ArrayList<Resources> resources = (ArrayList<Resources>) query.list();
        if(resources == null)
            resources = new ArrayList<Resources>();
        return resources;
    }

    public void deleteById(int id) {
        Resources resources = getResourcesById(id);
        sessionFactory.getCurrentSession().delete(resources);
    }
}
