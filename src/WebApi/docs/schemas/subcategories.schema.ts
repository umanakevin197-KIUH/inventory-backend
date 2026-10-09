export const SubcategoriesSchemas = {
  SubcategoriesRequest: {
    type: "object",
    required: [
      
        "category_id",
      
        "name",

        "status",
      
        "created_at"
      
    ],
    properties: {
      
      category_id: { type: "string" },
      
      name: { type: "string" },

      status: {type: "boolean"},
      
      created_at: { type: "string" },
      
    }
  },

  Subcategories: {
    type: "object",
    properties: {
      id: { type: "string" },
      
      category_id: { type: "string" },
      
      name: { type: "string" },

      status: {type: "boolean"},
      
      created_at: { type: "string" },
      
    }
  }
};
