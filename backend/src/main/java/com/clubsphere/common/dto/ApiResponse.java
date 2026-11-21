package com.clubsphere.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

/**
 * ApiResponse — A generic wrapper for all API responses.
 *
 * Instead of returning raw data, every endpoint returns this wrapper so the
 * frontend always knows: did it succeed? what's the message? and where's the data?
 *
 * Example JSON response:
 * {
 *   "success": true,
 *   "message": "Product created successfully",
 *   "data": { ... product object ... },
 *   "timestamp": "2024-01-15T10:30:00"
 * }
 *
 * @param <T> The type of data being returned (Product, List<Order>, etc.)
 */
@JsonInclude(JsonInclude.Include.NON_NULL) // Don't include null fields in JSON
public class ApiResponse<T> {

    // Was the request successful? true = yes, false = error occurred
    private boolean success;

    // Human-readable message describing what happened
    private String message;

    // The actual data being returned (can be null for error responses)
    private T data;

    // When this response was generated
    private LocalDateTime timestamp;

    // ===================== Constructors =====================

    /**
     * Default constructor — needed by Jackson for JSON serialization.
     */
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Constructor for a successful response with data.
     *
     * @param message Description of the successful action
     * @param data    The data to return to the client
     */
    public ApiResponse(String message, T data) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Constructor for a response with explicit success flag.
     *
     * @param success Whether the operation succeeded
     * @param message Description of what happened
     * @param data    The data to return (can be null)
     */
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // ===================== Static Factory Methods =====================

    /**
     * Creates a success response with data.
     * Use this when an operation completes successfully.
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * Creates a success response without data (e.g., for delete operations).
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }

    /**
     * Creates an error response.
     * Use this when something goes wrong.
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    // ===================== Getters and Setters =====================

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
