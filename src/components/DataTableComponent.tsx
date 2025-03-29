import React, { useState, useCallback, useMemo } from "react";
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
import { getAllProducts } from "../app/products/productsSlice";
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

type Order = "asc" | "desc" | null;

interface SortConfig {
  primary: {
    field: keyof Product | null;
    order: Order;
  };
  secondary: {
    field: keyof Product | null;
    order: Order;
  };
}

/**
 * DataTable component for displaying and managing products
 */
const DataTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentProducts: products,
    searchedProducts,
    isSearching,
  } = useSelector((state: RootState) => state.products);
  const { selectedProducts, isUpdatingStock, stockUpdateError } = useSelector(
    (state: RootState) => state.dataTable
  );

  const rows = isSearching ? searchedProducts : products;
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    primary: { field: null, order: null },
    secondary: { field: null, order: null },
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const compareValues = (a: any, b: any): number => {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;

    if (dayjs.isDayjs(a) && dayjs.isDayjs(b)) {
      return a.valueOf() - b.valueOf();
    }

    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }

    if (typeof a === "string" && typeof b === "string") {
      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }

    return String(a).localeCompare(String(b));
  };

  const sortData = useCallback(
    (data: Product[]): Product[] => {
      return [...data].sort((a, b) => {
        let comparison = 0;

        if (sortConfig.primary.field && sortConfig.primary.order) {
          const aValue = a[sortConfig.primary.field];
          const bValue = b[sortConfig.primary.field];

          comparison = compareValues(aValue, bValue);

          if (sortConfig.primary.order === "desc") {
            comparison *= -1;
          }
        }

        if (
          comparison === 0 &&
          sortConfig.secondary.field &&
          sortConfig.secondary.order
        ) {
          const aValue = a[sortConfig.secondary.field];
          const bValue = b[sortConfig.secondary.field];

          comparison = compareValues(aValue, bValue);

          if (sortConfig.secondary.order === "desc") {
            comparison *= -1;
          }
        }

        return comparison;
      });
    },
    [sortConfig]
  );

  const getCurrentPageRows = useCallback(() => {
    const sortedRows = sortData(rows);
    const start = (page - 1) * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage, sortData]);

  /**
   * Handles the selection/deselection of all products on the current page
   */
  const handleIsAllCheck = useCallback(async () => {
    const currentPageRows = getCurrentPageRows();
    const currentPageIds = currentPageRows.map((row) => row.id as number);
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
      dispatch(getAllProducts());
    } catch (error) {
      dispatch(setStockUpdateError((error as Error).message));
    } finally {
      dispatch(setIsUpdatingStock(false));
    }
  }, [dispatch, selectedProducts, getCurrentPageRows]);

  /**
   * Gets the state of the header checkbox based on current page selections
   */
  const getHeaderCheckboxState = useCallback(() => {
    const currentPageRows = getCurrentPageRows();
    const currentPageIds = currentPageRows.map((row) => row.id as number);
    const selectedOnCurrentPage = currentPageIds.filter((id) =>
      selectedProducts.includes(id)
    );

    if (selectedOnCurrentPage.length === 0) return false;
    if (selectedOnCurrentPage.length === currentPageRows.length) return true;
    return "indeterminate";
  }, [selectedProducts, getCurrentPageRows]);

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
        dispatch(getAllProducts());
      } catch (error) {
        dispatch(setStockUpdateError((error as Error).message));
      } finally {
        dispatch(setIsUpdatingStock(false));
      }
    },
    [dispatch, selectedProducts]
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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getNextSortOrder = (currentOrder: Order): Order => {
    if (currentOrder === null) return "asc";
    if (currentOrder === "asc") return "desc";
    return null;
  };

  const handleSort = (field: keyof Product) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.primary.field === field) {
        const nextOrder = getNextSortOrder(prevConfig.primary.order);
        if (nextOrder === null) {
          return {
            primary: {
              field: prevConfig.secondary.field,
              order: prevConfig.secondary.order,
            },
            secondary: { field: null, order: null },
          };
        }
        return {
          ...prevConfig,
          primary: { field, order: nextOrder },
        };
      }

      if (prevConfig.secondary.field === field) {
        const nextOrder = getNextSortOrder(prevConfig.secondary.order);
        if (nextOrder === null) {
          return {
            ...prevConfig,
            secondary: { field: null, order: null },
          };
        }
        return {
          ...prevConfig,
          secondary: { field, order: nextOrder },
        };
      }

      if (!prevConfig.primary.field || prevConfig.primary.order === null) {
        return {
          ...prevConfig,
          primary: { field, order: "asc" },
        };
      } else if (
        !prevConfig.secondary.field ||
        prevConfig.secondary.order === null
      ) {
        return {
          ...prevConfig,
          secondary: { field, order: "asc" },
        };
      }

      return {
        ...prevConfig,
        secondary: { field, order: "asc" },
      };
    });
  };

  const getSortDirection = (field: keyof Product): Order => {
    if (sortConfig.primary.field === field) {
      return sortConfig.primary.order;
    }
    if (sortConfig.secondary.field === field) {
      return sortConfig.secondary.order;
    }
    return null;
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

  const currentPageRows = getCurrentPageRows();
  const totalPages = Math.ceil(rows.length / rowsPerPage);

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
            {currentPageRows.map((row) => (
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
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DataTable;
