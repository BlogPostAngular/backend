const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog Post API",
      version: "1.0.0",
      description:
        "REST API for the Blog Post application — authentication, blogs, categories, users, and image uploads.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "/v1",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your access token (without the 'Bearer ' prefix)",
        },
      },
      schemas: {
        // ── Reusable response wrappers ──
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },

        // ── Auth ──
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              description: "Username or email",
              example: "john_doe",
            },
            password: {
              type: "string",
              example: "mypassword123",
            },
          },
        },
        GoogleAuthRequest: {
          type: "object",
          required: ["token"],
          properties: {
            token: {
              type: "string",
              description: "Google ID token from client-side sign-in",
            },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          required: ["refresh_token"],
          properties: {
            refresh_token: { type: "string" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                access_token: { type: "string" },
                refresh_token: { type: "string" },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        TokenRefreshResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                access_token: { type: "string" },
                refresh_token: { type: "string" },
              },
            },
          },
        },

        // ── User ──
        RegisterRequest: {
          type: "object",
          required: ["username", "password", "name", "email"],
          properties: {
            username: { type: "string", minLength: 3, example: "john_doe" },
            password: {
              type: "string",
              minLength: 6,
              example: "mypassword123",
            },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            personal_info: {
              type: "object",
              properties: {
                fullName: { type: "string", example: "John Updated" },
                bio: { type: "string", example: "A short bio" },
                profile_img: { type: "string" },
              },
            },
            social_links: {
              type: "object",
              properties: {
                youtube: { type: "string" },
                facebook: { type: "string" },
                twitter: { type: "string" },
                github: { type: "string" },
                instagram: { type: "string" },
                website: { type: "string" },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            personal_info: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                email: { type: "string" },
                username: { type: "string" },
                bio: { type: "string" },
                profile_img: { type: "string" },
              },
            },
            social_links: {
              type: "object",
              properties: {
                youtube: { type: "string" },
                facebook: { type: "string" },
                twitter: { type: "string" },
                github: { type: "string" },
                instagram: { type: "string" },
                website: { type: "string" },
              },
            },
            account_info: {
              type: "object",
              properties: {
                total_posts: { type: "integer" },
                total_reads: { type: "integer" },
              },
            },
            google_auth: { type: "boolean" },
            blogs: {
              type: "array",
              items: { type: "string" },
            },
            joinedAt: { type: "string", format: "date-time" },
          },
        },

        // ── Blog ──
        CreateBlogRequest: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string", maxLength: 200, example: "My First Blog" },
            content: {
              description: "String or array of content blocks",
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
              example: "This is the body of the blog post.",
            },
            des: {
              type: "string",
              maxLength: 600,
              example: "A short description",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["tech", "javascript"],
            },
            published: { type: "boolean", default: false },
            category: {
              type: "string",
              description: "Category ObjectId",
            },
            banner: { type: "string" },
            thumbnail: { type: "string" },
          },
        },
        UpdateBlogRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
            },
            des: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            published: { type: "boolean" },
            category: { type: "string" },
            banner: { type: "string" },
            thumbnail: { type: "string" },
          },
        },
        Blog: {
          type: "object",
          properties: {
            _id: { type: "string" },
            blog_id: { type: "string" },
            title: { type: "string" },
            des: { type: "string" },
            content: {},
            banner: { type: "string" },
            thumbnail: { type: "string" },
            author: { $ref: "#/components/schemas/User" },
            category: { $ref: "#/components/schemas/Category" },
            tags: { type: "array", items: { type: "string" } },
            activity: {
              type: "object",
              properties: {
                total_likes: { type: "integer" },
                total_comments: { type: "integer" },
                total_reads: { type: "integer" },
                total_parent_comments: { type: "integer" },
              },
            },
            draft: { type: "boolean" },
            published: { type: "boolean" },
            publishedAt: { type: "string", format: "date-time" },
            views: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BlogListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                blogs: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Blog" },
                },
                totalPages: { type: "integer" },
                currentPage: { type: "integer" },
                total: { type: "integer" },
              },
            },
          },
        },

        // ── Category ──
        Category: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name_en: { type: "string" },
            name_kh: { type: "string" },
            status: {
              type: "string",
              enum: ["active", "inactive"],
            },
            ordering: { type: "integer" },
            _active: { type: "boolean" },
            _deleted: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        CreateCategoryRequest: {
          type: "object",
          required: ["name_en", "name_kh"],
          properties: {
            name_en: { type: "string", example: "Technology" },
            name_kh: { type: "string", example: "បច្ចេកវិទ្យា" },
            ordering: { type: "integer", example: 1 },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              default: "active",
            },
          },
        },
        UpdateCategoryRequest: {
          type: "object",
          properties: {
            name_en: { type: "string" },
            name_kh: { type: "string" },
            ordering: { type: "integer" },
            status: { type: "string", enum: ["active", "inactive"] },
            _active: { type: "boolean" },
          },
        },

        // ── Upload ──
        UploadResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            url: {
              type: "string",
              example: "https://res.cloudinary.com/xxx/image/upload/v1/blog_images/abc.jpg",
            },
            public_id: {
              type: "string",
              example: "blog_images/abc",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./src/modules/**/*.routes.js", "./src/modules/**/*.controller.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
