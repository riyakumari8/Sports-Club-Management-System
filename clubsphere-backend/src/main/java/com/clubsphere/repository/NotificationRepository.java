package com.clubsphere.repository;

import com.clubsphere.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    long countByUserIdAndIsReadFalse(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE " +
           "(n.user.id = :userId) AND " +
           "(:category IS NULL OR n.category = :category) AND " +
           "(:severity IS NULL OR n.severity = :severity) AND " +
           "(:isRead IS NULL OR n.isRead = :isRead) " +
           "ORDER BY n.createdAt DESC")
    List<Notification> filterNotifications(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("severity") String severity,
            @Param("isRead") Boolean isRead
    );

    @Query("SELECT n FROM Notification n ORDER BY n.createdAt DESC")
    List<Notification> findAllOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM Notification n WHERE n.user.id = :userId AND n.isRead = true")
    void deleteReadByUserId(@Param("userId") Long userId);
}
