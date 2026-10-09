export const CategoriesSchemas = {
  CategoriesRequest: {
    type: "object",
    required: [
      
        "name",
      
        "description",
      
        "created_at"
      
    ],
    properties: {
      
      name: { type: "string" },
      
      description: { type: "string" },
      
      created_at: { type: "string" },
      
    }
  },

  Categories: {
    type: "object",
    properties: {
      id: { type: "string" },
      
      name: { type: "string" },
      
      description: { type: "string" },
      
      created_at: { type: "string" },
      
    }
  }
};
