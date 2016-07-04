package dao;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.hibernate.LockMode;

public interface Dao<T,PK> {
    T get(PK id);


    List<T> getList(List<PK> ids);


    List<T> getAll();


    List<T> getAll(Boolean desc, String orderProperName);


    List<T> page(int pageIndex, int pageSize);


    List<T> page(int pageIndex, int pageSize, Boolean desc, String orderProperName);


    PK save(T entity);


    void saveOrUpdate(T entity, Boolean... cache);

    void merge(T entity);


    int Count();


    void delete(T entity);


    void deleteAll(Collection<T> entities);
    void deleteByKey(PK id);


    void flush();


    void lock(T entity, LockMode lock);


    List<T> getPageByCriteria(Map<String, Object> params, final int indexPage,
                                              final int pageSize, Boolean desc, String orderProperName, List<String> groupName, Boolean... cache);


    List<T> getPageByCriteria(Map<String, Object> params, final int indexPage,
                                              final int pageSize, Boolean desc, String orderProperName, Boolean... cache);

    Integer getCountCriteria(Map<String, Object> params,
                                             List<String> nullColumnNames, String countName);


    List<T> getCountByCriteria(Map<String, Object> params, List<String> groupNames);

    List<T> getTByExample(T example, Boolean... cache);


    List<T> getTByExample(T example, Boolean desc, String orderProperName, Boolean... cache);


    List<T> getTByExample(T example, final int indexPage, final int pageSize,
                                          Boolean desc, String orderProperName, Boolean... cache);
}
