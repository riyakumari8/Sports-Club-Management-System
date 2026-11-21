package com.clubsphere.modules.membership.repository;

import com.clubsphere.modules.membership.entity.MembershipTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MembershipTransactionRepository extends JpaRepository<MembershipTransaction, Long> {
    List<MembershipTransaction> findByMemberIdOrderByPaidAtDesc(Long memberId);
    List<MembershipTransaction> findByPaidAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM MembershipTransaction t WHERE t.paymentStatus = 'PAID' AND t.paidAt BETWEEN :start AND :end")
    BigDecimal sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
