package dao;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.hibernate.LockMode;

public interface Dao<T,PK> {
	public abstract T get(PK id);


    public abstract List<T> getList(List<PK> ids);


    public abstract List<T> getAll();


    public abstract List<T> getAll(Boolean desc, String orderProperName);


    public abstract List<T> page(int pageIndex, int pageSize);


    public abstract List<T> page(int pageIndex, int pageSize, Boolean desc, String orderProperName);


    public abstract PK save(T entity);


    public abstract void saveOrUpdate(T entity, Boolean... cache);

    public abstract void merge(T entity);


    public abstract int Count();


    public abstract void delete(T entity);


    public abstract void deleteAll(Collection<T> entities);
    public abstract void deleteByKey(PK id);


    public abstract void flush();


    public abstract void lock(T entity, LockMode lock);


    public abstract List<T> getPageByCriteria(Map<String, Object> params, final int indexPage,
                                              final int pageSize, Boolean desc, String orderProperName, List<String> groupName, Boolean... cache);


    public abstract List<T> getPageByCriteria(Map<String, Object> params, final int indexPage,
                                              final int pageSize, Boolean desc, String orderProperName, Boolean... cache);

    public abstract Integer getCountCriteria(Map<String, Object> params,
                                             List<String> nullColumnNames, String countName);


    public abstract List<T> getCountByCriteria(Map<String, Object> params, List<String> groupNames);

    public abstract List<T> getTByExample(T example, Boolean... cache);


    public abstract List<T> getTByExample(T example, Boolean desc, String orderProperName, Boolean... cache);


    public abstract List<T> getTByExample(T example, final int indexPage, final int pageSize,
                                          Boolean desc, String orderProperName, Boolean... cache);
}
