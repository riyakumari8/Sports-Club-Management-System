package com.clubsphere.repository;

import com.clubsphere.model.TrialBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrialBookingRepository extends JpaRepository<TrialBooking, Long> {
    List<TrialBooking> findAllByOrderByTrialDateDescStartTimeDesc();
}
