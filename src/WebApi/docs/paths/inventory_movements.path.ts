export const inventory_movementsPaths = {
  "/inventory_movements": {
    get: {
      summary: "Get all inventory_movements",
      tags: ["inventory_movements"],
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
          description: "List of inventory_movements",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/inventory_movements" }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create inventory_movements",
      tags: ["inventory_movements"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/inventory_movementsRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "inventory_movements created"
        }
      }
    }
  },

  "/inventory_movements/{id}": {
    get: {
      summary: "Get inventory_movements by id",
      tags: ["inventory_movements"],
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
          description: "inventory_movements found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/inventory_movements" }
            }
          }
        },
        404: {
          description: "Not found"
        }
      }
    },

    put: {
      summary: "Update inventory_movements",
      tags: ["inventory_movements"],
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
            schema: { $ref: "#/components/schemas/inventory_movementsRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "inventory_movements updated"
        },
        404: {
          description: "Not found"
        }
      }
    },

    delete: {
      summary: "Delete inventory_movements",
      tags: ["inventory_movements"],
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
          description: "inventory_movements deleted"
        },
        404: {
          description: "Not found"
        }
      }
    }
  }
};
