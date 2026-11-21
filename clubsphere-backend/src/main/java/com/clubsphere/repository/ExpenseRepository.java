package com.clubsphere.repository;

import com.clubsphere.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    Optional<Expense> findByExpenseReference(String expenseReference);

    List<Expense> findAllByOrderByExpenseDateDesc();

    List<Expense> findByCategoryOrderByExpenseDateDesc(String category);

    List<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate start, LocalDate end);

    @Query("SELECT e FROM Expense e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:method IS NULL OR e.paymentMethod = :method) AND " +
           "(:start IS NULL OR e.expenseDate >= :start) AND " +
           "(:end IS NULL OR e.expenseDate <= :end) " +
           "ORDER BY e.expenseDate DESC")
    List<Expense> filterExpenses(
            @Param("category") String category,
            @Param("method") String method,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    BigDecimal sumTotalExpenses();

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate >= :start AND e.expenseDate <= :end")
    BigDecimal sumExpensesBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0) FROM Expense e GROUP BY e.category")
    List<Object[]> sumExpensesGroupedByCategory();

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate >= :start AND e.expenseDate <= :end GROUP BY e.category")
    List<Object[]> sumExpensesGroupedByCategoryBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
