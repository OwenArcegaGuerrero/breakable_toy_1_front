import React, { useState } from "react";
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
} from "@mui/material";
import { Product } from "../types/Product";
import { RootState } from "../app/store";
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

const DataTable: React.FC = () => {
  const products = useSelector(
    (state: RootState) => state.products.currentProducts
  );
  const rows = products;
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    primary: { field: null, order: null },
    secondary: { field: null, order: null },
  });

  const dispatch = useDispatch();

  const handleEditProduct = (product: Product) => {
    dispatch(openAddModal());
    dispatch(setAddName(product.name));
    dispatch(setAddCategory(product.category));
    dispatch(setAddExpirationDate(product.expirationDate));
    dispatch(setAddStock(product.quantityInStock));
    dispatch(setAddUnitPrice(product.unitPrice));
  };

  const handleDeleteProduct = () => {
    console.log(products[3].expirationDate?.diff(dayjs(), "days"));
    alert("Se ha borrado el producto");
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

  const sortData = (data: Product[]): Product[] => {
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

  const getExpirationColor = (expirationDate: dayjs.Dayjs | null): string => {
    if (!expirationDate) return "inherit";

    const daysUntilExpiration = expirationDate.diff(dayjs(), "days");

    if (daysUntilExpiration < 7) return "#FFC3C3";
    if (daysUntilExpiration < 14) return "#FBFF9C";
    return "#9CFFD2";
  };

  const getStockColor = (stock: number): string => {
    if (stock <= 4) return "#F99595";
    if (stock <= 10) return "#FECB9A";
    return "inherit";
  };

  const sortedData = sortData(rows);

  return (
    <TableContainer
      sx={{
        width: "90vw",
        margin: "2% auto",
      }}
      component={Paper}
    >
      <Table sx={{ border: "1px solid black" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <TableSortLabel
                active={getSortDirection("category") !== null}
                direction={getSortDirection("category") || "asc"}
                onClick={() => handleSort("category")}
              >
                <b>Category</b>
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={getSortDirection("name") !== null}
                direction={getSortDirection("name") || "asc"}
                onClick={() => handleSort("name")}
              >
                <b>Name</b>
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={getSortDirection("unitPrice") !== null}
                direction={getSortDirection("unitPrice") || "asc"}
                onClick={() => handleSort("unitPrice")}
              >
                <b>Price</b>
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={getSortDirection("expirationDate") !== null}
                direction={getSortDirection("expirationDate") || "asc"}
                onClick={() => handleSort("expirationDate")}
              >
                <b>Expiration Date</b>
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={getSortDirection("quantityInStock") !== null}
                direction={getSortDirection("quantityInStock") || "asc"}
                onClick={() => handleSort("quantityInStock")}
              >
                <b>Stock</b>
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow
              sx={{
                backgroundColor: getExpirationColor(row.expirationDate),
              }}
              key={row.id}
            >
              <TableCell align="center">{row.category}</TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">${row.unitPrice.toFixed(2)}</TableCell>
              <TableCell align="center">
                {row.expirationDate != null
                  ? row.expirationDate.format("DD/MM/YYYY")
                  : null}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  background: getStockColor(row.quantityInStock),
                }}
              >
                {row.quantityInStock}
              </TableCell>
              <TableCell align="center">
                <Box display={"flex"} gap={3} justifyContent={"center"}>
                  <Button
                    variant="contained"
                    onClick={() => handleEditProduct(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteProduct}
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
  );
};

export default DataTable;
