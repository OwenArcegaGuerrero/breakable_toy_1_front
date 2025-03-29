/**
 * Service for handling stock-related operations
 */
class StockService {
  private baseUrl = "http://localhost:9090/products";

  /**
   * Sets a product as out of stock
   * @param productId - The ID of the product to mark as out of stock
   */
  async setProductOutOfStock(productId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${productId}/outofstock`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to set product ${productId} out of stock`);
    }
  }

  /**
   * Sets a product as in stock
   * @param productId - The ID of the product to mark as in stock
   */
  async setProductInStock(productId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${productId}/instock`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error(`Failed to set product ${productId} in stock`);
    }
  }

  /**
   * Updates the stock status for multiple products
   * @param productIds - Array of product IDs to update
   * @param setInStock - Whether to set products in stock or out of stock
   */
  async bulkUpdateStockStatus(
    productIds: number[],
    setInStock: boolean
  ): Promise<void> {
    const updatePromises = productIds.map((id) =>
      setInStock ? this.setProductInStock(id) : this.setProductOutOfStock(id)
    );

    await Promise.all(updatePromises);
  }
}

export const stockService = new StockService();
