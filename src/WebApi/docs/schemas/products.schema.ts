export const ProductsSchemas = {
  ProductsRequest: {
    type: "object",
    required: [
      
        "category_id",
      
        "subcategory_id",
      
        "name",
      
        "description",
      
        "product_type",
      
        "status",
      
        "created_at",

        "price",

        "stock",

      
    ],
    properties: {
      
      category_id: { type: "string" },
      
      subcategory_id: { type: "string" },
      
      name: { type: "string" },
      
      description: { type: "string" },
      
      product_type: { type: "string" },
      
      status: { type: "string" },
      
      created_at: { type: "string" },

      price: { type: "number" },

      stock: { type: "number" },
      
    }
  },

  Products: {
    type: "object",
    properties: {
      id: { type: "string" },
      
      category_id: { type: "string" },
      
      subcategory_id: { type: "string" },
      
      name: { type: "string" },
      
      description: { type: "string" },
      
      product_type: { type: "string" },
      
      status: { type: "string" },
      
      created_at: { type: "string" },

      price: { type: "number" },
      
      stock: { type: "number" },
    }
  }
};
