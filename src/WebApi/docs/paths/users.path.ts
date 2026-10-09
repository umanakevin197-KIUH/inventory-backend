export const UsersPaths = {
  "/users": {
    get: {
      summary: "Get all Users",
      tags: ["Users"],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            example: 1
          },
          description: "Page number"
        },
        {
          name: "pageSize",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            example: 100
          },
          description: "Number of records per page"
        }
      ],
      responses: {
        200: {
          description: "List of Users",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Users" }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create Users",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UsersRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "Users created"
        }
      }
    }
  },

  "/users/{id}": {
    get: {
      summary: "Get Users by id",
      tags: ["Users"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: {
          description: "Users found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Users" }
            }
          }
        },
        404: {
          description: "Not found"
        }
      }
    },

    put: {
      summary: "Update Users",
      tags: ["Users"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { 
            type: "string",
            example: "1"
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UsersRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Users updated"
        },
        404: {
          description: "Not found"
        }
      }
    },

    delete: {
      summary: "Delete Users",
      tags: ["Users"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        204: {
          description: "Users deleted"
        },
        404: {
          description: "Not found"
        }
      }
    }
  }
};
