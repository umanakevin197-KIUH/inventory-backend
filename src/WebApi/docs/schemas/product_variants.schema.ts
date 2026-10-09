export const Product_variantsSchemas = {
  Product_variantsRequest: {
    type: "object",
    required: [
      
        "product_id",
      
        "sku",
      
        "size",
      
        "color",
      
        "brand",
      
        "stock",
      
        "price",
      
        "created_at"
      
    ],
    properties: {
      
      product_id: { type: "string" },
      
      sku: { type: "string" },
      
      size: { type: "string" },
      
      color: { type: "string" },
      
      brand: { type: "string" },
      
      stock: { type: "string" },
      
      price: { type: "string" },
      
      created_at: { type: "string" },
      
    }
  },

  Product_variants: {
    type: "object",
    properties: {
      id: { type: "string" },
      
      product_id: { type: "string" },
      
      sku: { type: "string" },
      
      size: { type: "string" },
      
      color: { type: "string" },
      
      brand: { type: "string" },
      
      stock: { type: "string" },
      
      price: { type: "string" },
      
      created_at: { type: "string" },
      
    }
  }
};
