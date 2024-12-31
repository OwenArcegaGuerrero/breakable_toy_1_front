import { Dayjs } from "dayjs";

export type Product = {
  id?: number;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Dayjs | null;
  quantityInStock: number;
  creationDate?: Dayjs;
  updateDate?: Dayjs | null;
};
