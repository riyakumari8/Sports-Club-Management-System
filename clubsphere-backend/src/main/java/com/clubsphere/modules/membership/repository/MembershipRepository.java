package com.clubsphere.modules.membership.repository;

import com.clubsphere.modules.membership.entity.Member;
import com.clubsphere.modules.membership.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByMemberOrderByCreatedAtDesc(Member member);
    Optional<Membership> findFirstByMemberAndStatusOrderByEndDateDesc(Member member, String status);
    Optional<Membership> findByMembershipNumber(String membershipNumber);
    Optional<Membership> findByQrCodeToken(String qrCodeToken);

    @Query("SELECT m FROM Membership m WHERE (m.membershipNumber = :query OR m.qrCodeToken = :query)")
    Optional<Membership> findByNumberOrQrToken(@Param("query") String query);

    @Query("SELECT m FROM Membership m WHERE m.status = 'ACTIVE' AND m.endDate < :today")
    List<Membership> findExpiredActiveMemberships(@Param("today") LocalDate today);

    @Query("SELECT m FROM Membership m WHERE m.status = 'ACTIVE' AND m.endDate = :targetDate")
    List<Membership> findActiveExpiringOn(@Param("targetDate") LocalDate targetDate);

    long countByStatus(String status);

    @Query("SELECT COUNT(m) FROM Membership m WHERE m.status = 'ACTIVE' AND m.plan.category = :category")
    long countActiveByCategory(@Param("category") String category);
}
