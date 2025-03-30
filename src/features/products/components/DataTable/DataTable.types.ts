import { Product } from "../../../../types/Product";

export interface DataTableProps {
  onEdit?: (product: Product) => void;
}

export interface DataTableHandlerProps {
  sortBy: string | null;
  setSortBy: (value: string | null) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
}
