package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.StaffPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StaffPermissionRepository extends JpaRepository<StaffPermission, Long> {
    List<StaffPermission> findByEmployeeId(Long employeeId);

    @Query("SELECT sp.permission.code FROM StaffPermission sp WHERE sp.employee.id = :employeeId")
    List<String> findPermissionCodesByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT CASE WHEN COUNT(sp) > 0 THEN true ELSE false END FROM StaffPermission sp " +
           "WHERE sp.employee.id = :employeeId AND sp.permission.code = :permissionCode")
    boolean hasPermission(@Param("employeeId") Long employeeId, @Param("permissionCode") String permissionCode);
}
