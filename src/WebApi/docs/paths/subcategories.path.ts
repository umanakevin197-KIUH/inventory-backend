export const SubcategoriesPaths = {
  "/subcategories": {
    get: {
      summary: "Get all Subcategories",
      tags: ["Subcategories"],
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
          description: "List of Subcategories",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Subcategories" }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create Subcategories",
      tags: ["Subcategories"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SubcategoriesRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "Subcategories created"
        }
      }
    }
  },

  "/subcategories/{id}": {
    get: {
      summary: "Get Subcategories by id",
      tags: ["Subcategories"],
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
          description: "Subcategories found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Subcategories" }
            }
          }
        },
        404: {
          description: "Not found"
        }
      }
    },

    put: {
      summary: "Update Subcategories",
      tags: ["Subcategories"],
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
            schema: { $ref: "#/components/schemas/SubcategoriesRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Subcategories updated"
        },
        404: {
          description: "Not found"
        }
      }
    },

    delete: {
      summary: "Delete Subcategories",
      tags: ["Subcategories"],
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
          description: "Subcategories deleted"
        },
        404: {
          description: "Not found"
        }
      }
    }
  }
};
