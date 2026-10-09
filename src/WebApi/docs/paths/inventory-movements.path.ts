export const Inventory-movementsPaths = {
  "/inventory-movements": {
    get: {
      summary: "Get all Inventory-movements",
      tags: ["Inventory-movements"],
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
          description: "List of Inventory-movements",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Inventory-movements" }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create Inventory-movements",
      tags: ["Inventory-movements"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Inventory-movementsRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "Inventory-movements created"
        }
      }
    }
  },

  "/inventory-movements/{id}": {
    get: {
      summary: "Get Inventory-movements by id",
      tags: ["Inventory-movements"],
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
          description: "Inventory-movements found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Inventory-movements" }
            }
          }
        },
        404: {
          description: "Not found"
        }
      }
    },

    put: {
      summary: "Update Inventory-movements",
      tags: ["Inventory-movements"],
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
            schema: { $ref: "#/components/schemas/Inventory-movementsRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Inventory-movements updated"
        },
        404: {
          description: "Not found"
        }
      }
    },

    delete: {
      summary: "Delete Inventory-movements",
      tags: ["Inventory-movements"],
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
          description: "Inventory-movements deleted"
        },
        404: {
          description: "Not found"
        }
      }
    }
  }
};
