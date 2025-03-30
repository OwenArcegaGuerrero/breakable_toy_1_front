import { describe, it, expect, vi, beforeEach } from "vitest";
import { stockService } from "../stockService";

describe("Stock Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should throw error when setting out of stock fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Failed to set out of stock")
    );

    await expect(stockService.setProductOutOfStock(1)).rejects.toThrow(
      "Failed to set out of stock"
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:9090/products/1/outofstock",
      expect.any(Object)
    );
  });

  it("should throw error when setting in stock fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Failed to set in stock")
    );

    await expect(stockService.setProductInStock(1)).rejects.toThrow(
      "Failed to set in stock"
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:9090/products/1/instock",
      expect.any(Object)
    );
  });

  it("should handle partial failure in bulk update", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      .mockRejectedValueOnce(new Error("Failed"))
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    const productIds = [1, 2];
    await expect(
      stockService.bulkUpdateStockStatus(productIds, false)
    ).rejects.toThrow("Failed");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:9090/products/1/outofstock",
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:9090/products/2/outofstock",
      expect.any(Object)
    );
  });
});
