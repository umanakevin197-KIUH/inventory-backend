export const UsersSchemas = {
  UsersRequest: {
    type: "object",
    required: [
      
        "name",
      
        "email",
      
        "password",
      
        "role",
      
        "created_at"
      
    ],
    properties: {
      
      name: { type: "string" },
      
      email: { type: "string" },
      
      password: { type: "string" },
      
      role: { type: "string" },
      
      created_at: { type: "string" },
      
    }
  },

  Users: {
    type: "object",
    properties: {
      id: { type: "string" },
      
      name: { type: "string" },
      
      email: { type: "string" },
      
      password: { type: "string" },
      
      role: { type: "string" },
      
      created_at: { type: "string" },
      
    }
  }
};
