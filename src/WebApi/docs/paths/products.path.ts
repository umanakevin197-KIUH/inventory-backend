export const ProductsPaths = {
  "/products": {
    get: {
      summary: "Get all Products",
      tags: ["Products"],
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
          description: "List of Products",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Products" }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create Products",
      tags: ["Products"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ProductsRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "Products created"
        }
      }
    }
  },

  "/products/{id}": {
    get: {
      summary: "Get Products by id",
      tags: ["Products"],
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
          description: "Products found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Products" }
            }
          }
        },
        404: {
          description: "Not found"
        }
      }
    },

    put: {
      summary: "Update Products",
      tags: ["Products"],
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
            schema: { $ref: "#/components/schemas/ProductsRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Products updated"
        },
        404: {
          description: "Not found"
        }
      }
    },

    delete: {
      summary: "Delete Products",
      tags: ["Products"],
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
          description: "Products deleted"
        },
        404: {
          description: "Not found"
        }
      }
    }
  }
};
