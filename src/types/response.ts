/**
 * Types related to HTTP responses
 */

/**
 * Base structure for error responses
 */
export interface ErrorResponse {
  error: string;
}

/**
 * Structure for paginated responses
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Structure for standard success responses
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}