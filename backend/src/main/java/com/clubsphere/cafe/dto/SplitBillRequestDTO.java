package com.clubsphere.cafe.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * SplitBillRequestDTO — Request containing multiple splits for dividing an order bill.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SplitBillRequestDTO {

    @NotEmpty(message = "Splits list cannot be empty")
    @Valid
    private List<BillSplitDTO> splits;
}
