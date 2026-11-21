package com.clubsphere.repository;

import com.clubsphere.model.EnquiryFollowup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryFollowupRepository extends JpaRepository<EnquiryFollowup, Long> {
    List<EnquiryFollowup> findByEnquiryEnquiryIdOrderByContactDateDesc(Long enquiryId);
}
