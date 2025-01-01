import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Report } from "../types/Reports";

const ReportTable: React.FC = () => {
  const products = useSelector(
    (state: RootState) => state.products.currentProducts
  );

  const [reports, setReports] = useState<Report[]>([]);
  const [overallReport, setOverallReport] = useState<Report | null>(null);

  useEffect(() => {
    createReports();
  }, [products]);

  const createReports = () => {
    const categoryMap: Record<
      string,
      { totalProducts: number; totalValue: number }
    > = {};
    let overallProductsInStock = 0;
    let overallValueInStock = 0;

    products.forEach((product) => {
      if ((product.quantityInStock as number) > 0) {
        if (!categoryMap[product.category]) {
          categoryMap[product.category] = { totalProducts: 0, totalValue: 0 };
        }
        categoryMap[product.category].totalProducts +=
          product.quantityInStock as number;
        categoryMap[product.category].totalValue +=
          (product.quantityInStock as number) * (product.unitPrice as number);

        overallProductsInStock += product.quantityInStock as number;
        overallValueInStock +=
          (product.quantityInStock as number) * (product.unitPrice as number);
      }
    });

    const categoryReports: Report[] = Object.entries(categoryMap).map(
      ([category, data]) => ({
        category,
        totalProducts: data.totalProducts,
        totalValue: data.totalValue,
        averagePrice: data.totalValue / data.totalProducts,
      })
    );

    const globalReport: Report = {
      category: "Overall",
      totalProducts: overallProductsInStock,
      totalValue: overallValueInStock,
      averagePrice:
        overallProductsInStock > 0
          ? overallValueInStock / overallProductsInStock
          : 0,
    };

    setReports(categoryReports);
    setOverallReport(globalReport);
  };

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
            <TableCell sx={{ border: "1px solid black" }} align="center">
              <b>Category</b>
            </TableCell>
            <TableCell sx={{ border: "1px solid black" }} align="center">
              <b>Total Products in Stock</b>
            </TableCell>
            <TableCell sx={{ border: "1px solid black" }} align="center">
              <b>Total Value in Stock</b>
            </TableCell>
            <TableCell sx={{ border: "1px solid black" }} align="center">
              <b>Average Price in Stock</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.category}>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                {report.category}
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                {report.totalProducts}
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                ${report.totalValue.toFixed(2)}
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                ${report.averagePrice.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          {overallReport && (
            <TableRow>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <b>{overallReport.category}</b>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <b>{overallReport.totalProducts}</b>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <b>${overallReport.totalValue.toFixed(2)}</b>
              </TableCell>
              <TableCell sx={{ border: "1px solid black" }} align="center">
                <b>${overallReport.averagePrice.toFixed(2)}</b>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;
