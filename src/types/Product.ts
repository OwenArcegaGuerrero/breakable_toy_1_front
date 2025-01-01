export type Product = {
  id?: number;
  name: string;
  category: string;
  unitPrice: number | string;
  expirationDate: string | null;
  quantityInStock: number | string;
  creationDate?: string;
  updateDate?: string | null;
};
