package com.clubsphere.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDiscountResponse {
    private boolean eligible;
    private Long memberId;
    private String memberName;
    private String planCategory;
    private double sportsShopDiscountPercent;
    private double cafeBarDiscountPercent;
    private String status;
}
