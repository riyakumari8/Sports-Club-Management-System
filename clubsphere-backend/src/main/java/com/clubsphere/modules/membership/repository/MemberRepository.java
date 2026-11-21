package com.clubsphere.modules.membership.repository;

import com.clubsphere.modules.membership.entity.Member;
import com.clubsphere.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(Long userId);
    Optional<Member> findByUser(User user);
    Optional<Member> findByMemberCode(String memberCode);
    boolean existsByMemberCode(String memberCode);
}
