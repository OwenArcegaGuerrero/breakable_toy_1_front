import { API_BASE_URL } from "../constants";

class StockService {
  async setProductOutOfStock(productId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/outofstock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to set product ${productId} out of stock`);
    }
  }

  async setProductInStock(productId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/instock`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to set product ${productId} in stock`);
    }
  }

  async bulkUpdateStockStatus(
    productIds: number[],
    setInStock: boolean
  ): Promise<void> {
    for (const productId of productIds) {
      try {
        if (setInStock) {
          await this.setProductInStock(productId);
        } else {
          await this.setProductOutOfStock(productId);
        }
      } catch (error) {
        throw new Error(
          `Failed to update stock status for product ${productId}`
        );
      }
    }
  }
}

export const stockService = new StockService();
