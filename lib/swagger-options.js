import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Love Jar API",
      version: "1.0.0",
      description: "API documentation for the Love Jar couple app. Scroll management endpoints.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "/api",
        description: "Current server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Firebase ID token - get from `user.getIdToken()` in client",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: { type: "string", description: "Error message" },
            code: { type: "string", description: "Error code" },
          },
        },
        Scroll: {
          type: "object",
          properties: {
            id: { type: "string", description: "Scroll document ID" },
            type: { type: "string", description: "Scroll type (e.g., 'Moment', 'Poem')" },
            content: { type: "string", description: "Decrypted scroll content" },
            username: { type: "string", description: "Creator display name" },
            imageUrl: { type: "string", nullable: true, description: "Optional image URL" },
            location: { type: "string", nullable: true, description: "Optional location" },
            songUrl: { type: "string", nullable: true, description: "Optional song URL for Lyric type" },
            verseUrl: { type: "string", nullable: true, description: "Optional verse URL for Verse type" },
            mapUrl: { type: "string", nullable: true, description: "Optional map URL for Moment type" },
            createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
            userId: { type: "string", description: "Creator user ID" },
            coupleId: { type: "string", description: "Couple ID" },
          },
        },
        ScrollResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            scrolls: { type: "array", items: { $ref: "#/components/schemas/Scroll" } },
            count: { type: "integer" },
            duration: { type: "integer", description: "Response time in ms" },
          },
        },
        RandomScrollResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            scroll: { $ref: "#/components/schemas/Scroll" },
            metadata: {
              type: "object",
              properties: {
                totalScrolls: { type: "integer" },
                selectedIndex: { type: "integer" },
                duration: { type: "integer" },
                fromPartner: { type: "boolean" },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Scrolls", description: "Scroll management endpoints" },
    ],
  },
  apis: ["./app/api/**/*.js", "./app/api/**/*.jsx"],
};

export const swaggerSpec = swaggerJsdoc(options);