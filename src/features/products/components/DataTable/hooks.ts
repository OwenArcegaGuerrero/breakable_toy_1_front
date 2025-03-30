import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { DataTableHandlerProps } from "./DataTable.types";
import { getAllProducts } from "../../store/productsSlice";
import { stockService } from "../../../../api/services/stockService";
import { AppDispatch } from "../../../../app/store";

export const useDataTableHandlers = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  currentPage,
  setCurrentPage,
}: DataTableHandlerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(column);
        setSortOrder("asc");
      }
    },
    [sortBy, sortOrder, setSortBy, setSortOrder]
  );

  const handleCheckboxChange = useCallback(
    async (productId: number, checked: boolean) => {
      try {
        if (checked) {
          await stockService.setProductOutOfStock(productId);
        } else {
          await stockService.setProductInStock(productId);
        }
        await dispatch(
          getAllProducts({ page: currentPage, sortBy, sortOrder })
        );
      } catch (error) {
        console.error("Failed to update stock status:", error);
      }
    },
    [dispatch, currentPage, sortBy, sortOrder]
  );

  const handleBulkAction = useCallback(
    async (productIds: number[], setOutOfStock: boolean) => {
      try {
        await stockService.bulkUpdateStockStatus(productIds, !setOutOfStock);
        await dispatch(
          getAllProducts({ page: currentPage, sortBy, sortOrder })
        );
      } catch (error) {
        console.error("Failed to update stock status:", error);
      }
    },
    [dispatch, currentPage, sortBy, sortOrder]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
    },
    [setCurrentPage]
  );

  return {
    handleSort,
    handleCheckboxChange,
    handleBulkAction,
    handlePageChange,
  };
};
