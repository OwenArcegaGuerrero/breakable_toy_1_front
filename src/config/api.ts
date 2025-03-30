export const API_BASE_URL = "http://localhost:9090";

export const ENDPOINTS = {
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    OUT_OF_STOCK: (id: number) => `${API_BASE_URL}/products/${id}/outofstock`,
    IN_STOCK: (id: number) => `${API_BASE_URL}/products/${id}/instock`,
    UPDATE: (id: number) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/products/${id}`,
  },
};
