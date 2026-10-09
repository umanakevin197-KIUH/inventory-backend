export const CategoriesPaths = {
  "/categories": {
    get: {
      summary: "Get all Categories",
      tags: ["Categories"],
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
          description: "List of Categories",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Categories" }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create Categories",
      tags: ["Categories"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CategoriesRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "Categories created"
        }
      }
    }
  },

  "/categories/{id}": {
    get: {
      summary: "Get Categories by id",
      tags: ["Categories"],
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
          description: "Categories found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Categories" }
            }
          }
        },
        404: {
          description: "Not found"
        }
      }
    },

    put: {
      summary: "Update Categories",
      tags: ["Categories"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CategoriesRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Categories updated"
        },
        404: {
          description: "Not found"
        }
      }
    },

    delete: {
      summary: "Delete Categories",
      tags: ["Categories"],
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
          description: "Categories deleted"
        },
        404: {
          description: "Not found"
        }
      }
    }
  }
};
