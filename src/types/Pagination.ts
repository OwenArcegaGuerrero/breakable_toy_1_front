/**
 * Interface for pagination request parameters
 */
export interface PaginationRequest {
  page: number;
  size: number;
}

/**
 * Interface for sort criteria
 */
export interface SortCriteria {
  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
  secondarySortBy: string | null;
  secondarySortOrder: "asc" | "desc" | null;
}

/**
 * Interface for paginated response from the server
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}
