import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../../../types/Product";
import { DataTableProps } from "./DataTable.types";
import { useDataTableHandlers } from "./hooks";
import {
  selectProducts,
  selectTotalElements,
} from "../../store/productsSelectors";
import { getAllProducts } from "../../store/productsSlice";
import { AppDispatch } from "../../../../app/store";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { RootState } from "../../../../app/store";
import { clearError } from "../../store/productsSlice";

export const DataTable = ({ onEdit }: DataTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.products.currentProducts
  );
  const totalElements = useSelector(selectTotalElements);
  const [currentPage, setCurrentPage] = useState(
    useSelector((state: RootState) => state.products.currentPage)
  );
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const isLoading = useSelector((state: RootState) => state.products.isLoading);
  const error = useSelector((state: RootState) => state.products.error);
  const pageSize = useSelector((state: RootState) => state.products.pageSize);

  const {
    handleSort,
    handleCheckboxChange,
    handleBulkAction,
    handlePageChange,
  } = useDataTableHandlers({
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
  });

  useEffect(() => {
    dispatch(getAllProducts({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!products.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No products found. Try adding some products!
        </Alert>
      </Box>
    );
  }

  const isNearExpiry = (expirationDate: string | null) => {
    if (!expirationDate) return false;
    const daysUntilExpiry = dayjs(expirationDate).diff(dayjs(), "day");
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.length === products.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(products.map((p) => p.id!));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell onClick={() => handleSort("name")}>Name</TableCell>
              <TableCell onClick={() => handleSort("category")}>
                Category
              </TableCell>
              <TableCell onClick={() => handleSort("unitPrice")}>
                Price
              </TableCell>
              <TableCell onClick={() => handleSort("expirationDate")}>
                Expiration Date
              </TableCell>
              <TableCell onClick={() => handleSort("quantityInStock")}>
                Stock
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const isOutOfStock = product.quantityInStock === 0;
              const nearExpiry = isNearExpiry(product.expirationDate);

              return (
                <TableRow
                  key={product.id}
                  sx={{
                    textDecoration: isOutOfStock ? "line-through" : "none",
                    backgroundColor: nearExpiry ? "#ffc3c3" : "inherit",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(product.id!)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setSelectedRows([...selectedRows, product.id!]);
                        } else {
                          setSelectedRows(
                            selectedRows.filter((id) => id !== product.id)
                          );
                        }
                        handleCheckboxChange(product.id!, checked);
                      }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                  <TableCell>{product.expirationDate || "N/A"}</TableCell>
                  <TableCell>{product.quantityInStock}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onEdit?.(product)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Button
            variant="contained"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Typography component="span" sx={{ mx: 2 }}>
            Page {currentPage + 1}
          </Typography>
          <Button
            variant="contained"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={(currentPage + 1) * 10 >= totalElements}
          >
            Next
          </Button>
        </Box>

        {selectedRows.length > 0 && (
          <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleBulkAction(selectedRows, true)}
              sx={{ mr: 1 }}
            >
              Set Selected Out of Stock
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBulkAction(selectedRows, false)}
            >
              Set Selected In Stock
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DataTable;
