import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../../../types/Product";
import { useDataTableStyles } from "./DataTable.styles";
import { DataTableProps } from "./DataTable.types";
import { useDataTableHandlers } from "./hooks";
import {
  selectProducts,
  selectTotalElements,
} from "../../store/productsSelectors";
import { getAllProducts } from "../../store/productsSlice";
import { AppDispatch } from "../../../../app/store";
import dayjs from "dayjs";

export const DataTable = ({ onEdit }: DataTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const totalElements = useSelector(selectTotalElements);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    StyledTable,
    TableHeader,
    TableCell,
    LoadingOverlay,
    OutOfStockRow,
    NearExpiryRow,
  } = useDataTableStyles();

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
    setIsLoading(true);
    dispatch(getAllProducts({ page: currentPage, sortBy, sortOrder })).finally(
      () => setIsLoading(false)
    );
  }, [dispatch, currentPage, sortBy, sortOrder]);

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
    <div style={{ position: "relative" }}>
      {isLoading && (
        <LoadingOverlay>
          <div>Loading...</div>
        </LoadingOverlay>
      )}

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    setSelectedRows(products.map((p) => p.id!));
                  } else {
                    setSelectedRows([]);
                  }
                }}
                checked={selectedRows.length === products.length}
              />
            </TableHeader>
            <TableHeader onClick={() => handleSort("name")}>Name</TableHeader>
            <TableHeader onClick={() => handleSort("category")}>
              Category
            </TableHeader>
            <TableHeader onClick={() => handleSort("unitPrice")}>
              Price
            </TableHeader>
            <TableHeader onClick={() => handleSort("expirationDate")}>
              Expiration Date
            </TableHeader>
            <TableHeader onClick={() => handleSort("quantityInStock")}>
              Stock
            </TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isOutOfStock = product.quantityInStock === 0;
            const RowComponent = isOutOfStock
              ? OutOfStockRow
              : isNearExpiry(product.expirationDate)
              ? NearExpiryRow
              : "tr";

            return (
              <RowComponent key={product.id}>
                <TableCell>
                  <input
                    type="checkbox"
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
                  <button onClick={() => onEdit?.(product)}>Edit</button>
                </TableCell>
              </RowComponent>
            );
          })}
        </tbody>
      </StyledTable>

      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={(currentPage + 1) * 10 >= totalElements}
        >
          Next
        </button>
      </div>

      {selectedRows.length > 0 && (
        <div>
          <button onClick={() => handleBulkAction(selectedRows, true)}>
            Set Selected Out of Stock
          </button>
          <button onClick={() => handleBulkAction(selectedRows, false)}>
            Set Selected In Stock
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
