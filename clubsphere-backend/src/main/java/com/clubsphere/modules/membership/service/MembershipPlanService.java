package com.clubsphere.modules.membership.service;

import com.clubsphere.common.exceptions.BadRequestException;
import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.membership.dto.PlanDto;
import com.clubsphere.modules.membership.entity.MembershipPlan;
import com.clubsphere.modules.membership.repository.MembershipPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MembershipPlanService {

    private final MembershipPlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<PlanDto> getAllActivePlans() {
        return planRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlanDto> getAllPlansAdmin() {
        return planRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlanDto getPlanById(Integer id) {
        MembershipPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found: " + id));
        return mapToDto(plan);
    }

    @Transactional
    public PlanDto createPlan(PlanDto dto) {
        if (planRepository.findByPlanCode(dto.getPlanCode().toUpperCase()).isPresent()) {
            throw new BadRequestException("Plan code already exists: " + dto.getPlanCode());
        }

        MembershipPlan plan = MembershipPlan.builder()
                .planCode(dto.getPlanCode().trim().toUpperCase())
                .name(dto.getName().trim())
                .category(dto.getCategory().trim().toUpperCase())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .durationDays(dto.getDurationDays())
                .minAge(dto.getMinAge())
                .maxAge(dto.getMaxAge())
                .benefits(dto.getBenefits())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return mapToDto(planRepository.save(plan));
    }

    @Transactional
    public PlanDto updatePlan(Integer id, PlanDto dto) {
        MembershipPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found: " + id));

        plan.setName(dto.getName());
        plan.setCategory(dto.getCategory().toUpperCase());
        plan.setDescription(dto.getDescription());
        plan.setPrice(dto.getPrice());
        plan.setDurationDays(dto.getDurationDays());
        plan.setMinAge(dto.getMinAge());
        plan.setMaxAge(dto.getMaxAge());
        plan.setBenefits(dto.getBenefits());
        if (dto.getIsActive() != null) {
            plan.setIsActive(dto.getIsActive());
        }

        return mapToDto(planRepository.save(plan));
    }

    public PlanDto mapToDto(MembershipPlan plan) {
        return PlanDto.builder()
                .id(plan.getId())
                .planCode(plan.getPlanCode())
                .name(plan.getName())
                .category(plan.getCategory())
                .description(plan.getDescription())
                .price(plan.getPrice())
                .durationDays(plan.getDurationDays())
                .minAge(plan.getMinAge())
                .maxAge(plan.getMaxAge())
                .benefits(plan.getBenefits())
                .isActive(plan.getIsActive())
                .build();
    }
}
