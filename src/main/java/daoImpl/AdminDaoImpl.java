package daoImpl;

import dao.AdminDao;
import model.Admin;
import org.springframework.stereotype.Repository;

/**
 * Created by Mouze on 2016/7/6.
 */
@Repository("AdminDao")
public class AdminDaoImpl extends DaoImpl<Admin, String> implements AdminDao{
}
