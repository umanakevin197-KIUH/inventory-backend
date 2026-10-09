export const AuthPaths = {

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string"
                },
                password: {
                  type: "string"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Login successful"
        }
      }
    }
  },

  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string"
                },
                email: {
                  type: "string"
                },
                password: {
                  type: "string"
                },
                role: {
                  type: "string"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "User registered"
        }
      }
    }
  }

};