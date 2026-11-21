package com.clubsphere.cafe.controller;

import com.clubsphere.cafe.dto.CafeteriaTableDTO;
import com.clubsphere.cafe.service.TableService;
import com.clubsphere.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafe/tables")
@RequiredArgsConstructor
public class CafeteriaTableController {

    private final TableService tableService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CafeteriaTableDTO>>> getAllTables(
            @RequestParam(required = false) String status) {
        List<CafeteriaTableDTO> tables = status != null
                ? tableService.getTablesByStatus(status)
                : tableService.getAllTables();
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved", tables));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CafeteriaTableDTO>> createTable(
            @Valid @RequestBody CafeteriaTableDTO dto) {
        CafeteriaTableDTO table = tableService.createTable(dto);
        return ResponseEntity.ok(ApiResponse.success("Table created", table));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CafeteriaTableDTO>> updateTable(
            @PathVariable Long id, @Valid @RequestBody CafeteriaTableDTO dto) {
        CafeteriaTableDTO table = tableService.updateTable(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Table updated", table));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CafeteriaTableDTO>> updateTableStatus(
            @PathVariable Long id, @RequestParam String status) {
        CafeteriaTableDTO table = tableService.updateTableStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Table status updated", table));
    }
}
