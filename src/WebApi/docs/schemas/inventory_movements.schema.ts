export const inventory_movementsSchemas = {
  inventory_movementsRequest: {
    type: "object",
    required: [
      
        "product_id",
      
        "movement_type",
      
        "quantity",
      
        "reason",
      
        "created_by",
      
        "created_at"
      
    ],
    properties: {
      
      product_id: { type: "number" },
      
      movement_type: { type: "string" },
      
      quantity: { type: "number" },
      
      reason: { type: "string" },
      
      created_by: { type: "number" },
      
      created_at: { type: "string" },
      
    }
  },

  inventory_movements: {
    type: "object",
    properties: {
      id: { type: "string" },
      
      product_id: { type: "number" },
      
      movement_type: { type: "string" },
      
      quantity: { type: "number" },
      
      reason: { type: "string" },
      
      created_by: { type: "number" },
      
      created_at: { type: "string" },
      
    }
  }
};
