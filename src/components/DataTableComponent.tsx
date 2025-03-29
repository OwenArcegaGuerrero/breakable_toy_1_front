import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
  Button,
  Checkbox,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Product } from "../types/Product";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  setAddCategory,
  setAddExpirationDate,
  setAddName,
  setAddStock,
  setAddUnitPrice,
} from "../app/addModal/addModalSlice";
import dayjs from "dayjs";
import {
  getAllProducts,
  setCurrentProducts,
} from "../app/products/productsSlice";
import {
  setIsEditing,
  setUpdateProductId,
  toggleProductSelection,
  setSelectedProducts,
  clearSelectedProducts,
  setIsUpdatingStock,
  setStockUpdateError,
} from "../app/dataTable/dataTableSlice";
import { stockService } from "../services/stockService";
import { PaginationRequest, SortCriteria } from "../types/Pagination";

/**
 * Converts an object to URL parameters, handling null values
 */
const objectToURLParams = (
  obj: Record<string, any>
): Record<string, string> => {
  const params: Record<string, string> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params[key] = String(value);
    }
  });
  return params;
};

/**
 * DataTable component for displaying and managing products
 */
const DataTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentProducts: products,
    searchedProducts,
    isSearching,
    totalElements,
  } = useSelector((state: RootState) => state.products);
  const { selectedProducts, isUpdatingStock, stockUpdateError } = useSelector(
    (state: RootState) => state.dataTable
  );

  const [page, setPage] = useState(0); // Changed to 0-based for backend compatibility
  const [sortConfig, setSortConfig] = useState<SortCriteria>({
    sortBy: null,
    sortOrder: null,
    secondarySortBy: null,
    secondarySortOrder: null,
  });
  const rowsPerPage = 10;

  const rows = isSearching ? searchedProducts : products;

  /**
   * Fetches products with current pagination and sorting
   */
  const fetchProducts = useCallback(async () => {
    const pagination: PaginationRequest = {
      page,
      size: rowsPerPage,
    };

    const params = objectToURLParams({
      ...pagination,
      ...sortConfig,
    });

    try {
      const response = await fetch(
        `http://localhost:9090/products?${new URLSearchParams(params)}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      dispatch(setCurrentProducts(data));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [page, rowsPerPage, sortConfig, dispatch]);

  // Fetch products when pagination or sorting changes
  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Handles the selection/deselection of all products on the current page
   */
  const handleIsAllCheck = useCallback(async () => {
    const currentPageIds = rows.map((row) => row.id as number);
    const selectedOnCurrentPage = currentPageIds.filter((id) =>
      selectedProducts.includes(id)
    );

    dispatch(setIsUpdatingStock(true));
    dispatch(setStockUpdateError(null));

    try {
      if (selectedOnCurrentPage.length === currentPageIds.length) {
        // Deselect all on current page
        const newSelected = selectedProducts.filter(
          (id) => !currentPageIds.includes(id)
        );
        dispatch(setSelectedProducts(newSelected));
        await stockService.bulkUpdateStockStatus(currentPageIds, true);
      } else {
        // Select all on current page
        const newSelected = [
          ...new Set([...selectedProducts, ...currentPageIds]),
        ];
        dispatch(setSelectedProducts(newSelected));
        await stockService.bulkUpdateStockStatus(currentPageIds, false);
      }
      fetchProducts();
    } catch (error) {
      dispatch(setStockUpdateError((error as Error).message));
    } finally {
      dispatch(setIsUpdatingStock(false));
    }
  }, [dispatch, selectedProducts, rows, fetchProducts]);

  /**
   * Gets the state of the header checkbox based on current page selections
   */
  const getHeaderCheckboxState = useCallback(() => {
    const currentPageIds = rows.map((row) => row.id as number);
    const selectedOnCurrentPage = currentPageIds.filter((id) =>
      selectedProducts.includes(id)
    );

    if (selectedOnCurrentPage.length === 0) return false;
    if (selectedOnCurrentPage.length === currentPageIds.length) return true;
    return "indeterminate";
  }, [selectedProducts, rows]);

  /**
   * Handles the selection/deselection of a single product
   */
  const handleProductSelect = useCallback(
    async (productId: number) => {
      dispatch(setIsUpdatingStock(true));
      dispatch(setStockUpdateError(null));

      try {
        const isSelected = selectedProducts.includes(productId);
        await stockService.bulkUpdateStockStatus([productId], isSelected);
        dispatch(toggleProductSelection(productId));
        fetchProducts();
      } catch (error) {
        dispatch(setStockUpdateError((error as Error).message));
      } finally {
        dispatch(setIsUpdatingStock(false));
      }
    },
    [dispatch, selectedProducts, fetchProducts]
  );

  const handleEditProduct = (product: Product) => {
    dispatch(openAddModal());
    dispatch(setAddName(product.name));
    dispatch(setAddCategory(product.category));
    dispatch(setAddExpirationDate(product.expirationDate));
    dispatch(setAddStock(product.quantityInStock));
    dispatch(setAddUnitPrice(product.unitPrice));
  };

  const deleteProduct = async (id: number) => {
    await fetch("http://localhost:9090/products/delete/" + id, {
      method: "DELETE",
    }).then((response) => {
      if (response.status == 204) {
        alert("Product deleted successfully");
      } else {
        alert("Error while deleting product");
      }
    });
    dispatch(getAllProducts());
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
  };

  /**
   * Handles sorting when a column header is clicked
   */
  const handleSort = (field: keyof Product) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.sortBy === field) {
        // Toggle primary sort order or clear if already desc
        if (!prevConfig.sortOrder || prevConfig.sortOrder === "asc") {
          return { ...prevConfig, sortOrder: "desc" };
        }
        return {
          sortBy: prevConfig.secondarySortBy,
          sortOrder: prevConfig.secondarySortOrder,
          secondarySortBy: null,
          secondarySortOrder: null,
        };
      }

      if (prevConfig.secondarySortBy === field) {
        // Toggle secondary sort order or clear if already desc
        if (
          !prevConfig.secondarySortOrder ||
          prevConfig.secondarySortOrder === "asc"
        ) {
          return { ...prevConfig, secondarySortOrder: "desc" };
        }
        return {
          ...prevConfig,
          secondarySortBy: null,
          secondarySortOrder: null,
        };
      }

      // Set as primary sort if no sort exists
      if (!prevConfig.sortBy) {
        return { ...prevConfig, sortBy: field, sortOrder: "asc" };
      }

      // Set as secondary sort
      return {
        ...prevConfig,
        secondarySortBy: field,
        secondarySortOrder: "asc",
      };
    });
  };

  /**
   * Gets the current sort direction for a field
   */
  const getSortDirection = (field: keyof Product): "asc" | "desc" | null => {
    if (sortConfig.sortBy === field) return sortConfig.sortOrder;
    if (sortConfig.secondarySortBy === field)
      return sortConfig.secondarySortOrder;
    return null;
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1); // Convert to 0-based for backend
  };

  const getExpirationColor = (expirationDate: string | null): string => {
    if (!expirationDate) return "inherit";
    const daysUntilExpiration = dayjs(expirationDate).diff(dayjs(), "days");
    if (daysUntilExpiration < 7) return "#FFC3C3";
    if (daysUntilExpiration < 14) return "#FBFF9C";
    return "#9CFFD2";
  };

  const getStockColor = (stock: number): string => {
    if (stock <= 4) return "#F99595";
    if (stock <= 10) return "#FECB9A";
    return "inherit";
  };

  const totalPages = Math.ceil(totalElements / rowsPerPage);

  return (
    <Box>
      {stockUpdateError && (
        <Snackbar
          open={!!stockUpdateError}
          autoHideDuration={6000}
          onClose={() => dispatch(setStockUpdateError(null))}
        >
          <Alert
            severity="error"
            onClose={() => dispatch(setStockUpdateError(null))}
          >
            {stockUpdateError}
          </Alert>
        </Snackbar>
      )}
      <TableContainer
        sx={{
          width: "90vw",
          margin: "2% auto",
          position: "relative",
        }}
        component={Paper}
      >
        {isUpdatingStock && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Table sx={{ border: "1px solid black" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ border: "1px solid black" }}
                align="center"
                width={"10px"}
              >
                <Checkbox
                  checked={getHeaderCheckboxState() === true}
                  indeterminate={getHeaderCheckboxState() === "indeterminate"}
                  onChange={handleIsAllCheck}
                  disabled={isUpdatingStock}
                />
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <TableSortLabel
                  active={getSortDirection("category") !== null}
                  direction={getSortDirection("category") || "asc"}
                  onClick={() => handleSort("category")}
                >
                  <b>Category</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <TableSortLabel
                  active={getSortDirection("name") !== null}
                  direction={getSortDirection("name") || "asc"}
                  onClick={() => handleSort("name")}
                >
                  <b>Name</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <TableSortLabel
                  active={getSortDirection("unitPrice") !== null}
                  direction={getSortDirection("unitPrice") || "asc"}
                  onClick={() => handleSort("unitPrice")}
                >
                  <b>Price</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <TableSortLabel
                  active={getSortDirection("expirationDate") !== null}
                  direction={getSortDirection("expirationDate") || "asc"}
                  onClick={() => handleSort("expirationDate")}
                >
                  <b>Expiration Date</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <TableSortLabel
                  active={getSortDirection("quantityInStock") !== null}
                  direction={getSortDirection("quantityInStock") || "asc"}
                  onClick={() => handleSort("quantityInStock")}
                >
                  <b>Stock</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: getExpirationColor(row.expirationDate),
                  textDecorationLine:
                    row.quantityInStock === 0 ? "line-through" : "inherit",
                  opacity: isUpdatingStock ? 0.5 : 1,
                }}
              >
                <TableCell sx={{ border: "1px solid black" }} align="center">
                  <Checkbox
                    checked={selectedProducts.includes(row.id as number)}
                    onChange={() => handleProductSelect(row.id as number)}
                    disabled={isUpdatingStock}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }} align="center">
                  {row.category}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }} align="center">
                  {row.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }} align="center">
                  ${(row.unitPrice as Number).toFixed(2)}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }} align="center">
                  {row.expirationDate != null ? row.expirationDate : "N/A"}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    background: getStockColor(row.quantityInStock as number),
                    border: "1px solid black",
                  }}
                >
                  {row.quantityInStock}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }} align="center">
                  <Box display={"flex"} gap={3} justifyContent={"center"}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(setUpdateProductId(row.id ? row.id : 0));
                        dispatch(setIsEditing(true));
                        handleEditProduct(row);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProduct(row.id ? row.id : 0)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DataTable;
