export const Product_variantsPaths = {
  "/product_variants": {
    get: {
      summary: "Get all Product_variants",
      tags: ["Product_variants"],
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
          description: "List of Product_variants",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Product_variants" }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create Product_variants",
      tags: ["Product_variants"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Product_variantsRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "Product_variants created"
        }
      }
    }
  },

  "/product_variants/{id}": {
    get: {
      summary: "Get Product_variants by id",
      tags: ["Product_variants"],
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
          description: "Product_variants found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product_variants" }
            }
          }
        },
        404: {
          description: "Not found"
        }
      }
    },

    put: {
      summary: "Update Product_variants",
      tags: ["Product_variants"],
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
            schema: { $ref: "#/components/schemas/Product_variantsRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Product_variants updated"
        },
        404: {
          description: "Not found"
        }
      }
    },

    delete: {
      summary: "Delete Product_variants",
      tags: ["Product_variants"],
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
          description: "Product_variants deleted"
        },
        404: {
          description: "Not found"
        }
      }
    }
  }
};
