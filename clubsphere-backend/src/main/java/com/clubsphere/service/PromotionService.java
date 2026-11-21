package com.clubsphere.service;

import com.clubsphere.model.Promotion;
import com.clubsphere.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<Promotion> getAllPromotions(String category, String status) {
        if (category == null && status == null) {
            return promotionRepository.findAll();
        }
        return promotionRepository.searchPromotions(category, status);
    }

    public List<Promotion> getActivePromotions() {
        return promotionRepository.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    public Promotion getPromotionById(Long id) {
        return promotionRepository.findById(id).orElse(null);
    }
}
