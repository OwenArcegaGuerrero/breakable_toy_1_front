import styled from "styled-components";

export const useDataTableStyles = () => {
  const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  `;

  const TableHeader = styled.th`
    padding: 1rem;
    text-align: left;
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    cursor: pointer;

    &:hover {
      background-color: #e9ecef;
    }
  `;

  const TableCell = styled.td`
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
  `;

  const LoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const OutOfStockRow = styled.tr`
    text-decoration: line-through;
    color: #6c757d;
  `;

  const NearExpiryRow = styled.tr`
    background-color: #ffc3c3;
  `;

  return {
    StyledTable,
    TableHeader,
    TableCell,
    LoadingOverlay,
    OutOfStockRow,
    NearExpiryRow,
  };
};
