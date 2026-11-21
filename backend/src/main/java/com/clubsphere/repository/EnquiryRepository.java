package com.clubsphere.repository;

import com.clubsphere.model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    @Query("SELECT e FROM Enquiry e WHERE (CAST(:status AS String) IS NULL OR e.status = :status) " +
           "AND (CAST(:sport AS String) IS NULL OR LOWER(e.interestedSport) = LOWER(CAST(:sport AS String))) " +
           "AND (CAST(:search AS String) IS NULL OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%')) OR e.phone LIKE CONCAT('%', CAST(:search AS String), '%')) " +
           "ORDER BY e.createdAt DESC")
    List<Enquiry> searchEnquiries(@Param("status") String status,
                                 @Param("sport") String sport,
                                 @Param("search") String search);
}
