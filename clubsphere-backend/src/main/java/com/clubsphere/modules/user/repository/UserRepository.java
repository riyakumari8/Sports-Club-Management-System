package com.clubsphere.modules.user.repository;

import com.clubsphere.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRoles_Name(com.clubsphere.modules.user.entity.ERole name);
    List<User> findByTrialStatus(String trialStatus);

    @Query("SELECT u FROM User u WHERE " +
           "(CAST(:query AS String) IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:query AS String), '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', CAST(:query AS String), '%')) OR " +
           "u.phone LIKE CONCAT('%', CAST(:query AS String), '%')) AND " +
           "(CAST(:status AS String) IS NULL OR u.status = CAST(:status AS String))")
    List<User> searchUsers(@Param("query") String query, @Param("status") String status);
}
