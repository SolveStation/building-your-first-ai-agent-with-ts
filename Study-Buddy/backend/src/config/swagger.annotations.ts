/**
 * Swagger/OpenAPI Annotations
 * Comprehensive API documentation for all endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     tags: [Authentication]
 *     summary: Get Google OAuth URL
 *     description: Returns Google OAuth authorization URL for user to visit
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OAuth URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authUrl:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     tags: [Authentication]
 *     summary: Google OAuth callback
 *     description: Handle Google OAuth callback and save tokens
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Google account connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 hasGoogleAccess:
 *                   type: boolean
 *       400:
 *         description: Invalid authorization code
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user
 *     description: Returns current authenticated user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/study-plan:
 *   post:
 *     tags: [Study Plans]
 *     summary: Create study plan
 *     description: Create a new study plan with uploaded materials (PDF, DOCX, TXT)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - difficulty
 *               - duration
 *               - materials
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Machine Learning Basics
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: intermediate
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 365
 *                 example: 14
 *                 description: Duration in days
 *               materials:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Study material files (max 60MB each, up to 10 files)
 *     responses:
 *       201:
 *         description: Study plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 studyPlan:
 *                   $ref: '#/components/schemas/StudyPlan'
 *       400:
 *         description: Validation error or no files uploaded
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/study-plan:
 *   get:
 *     tags: [Study Plans]
 *     summary: Get all study plans
 *     description: Returns all study plans for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Study plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studyPlans:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudyPlan'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/study-plan/{id}:
 *   get:
 *     tags: [Study Plans]
 *     summary: Get study plan by ID
 *     description: Returns a specific study plan with resources and calendar events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Study plan ID
 *     responses:
 *       200:
 *         description: Study plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studyPlan:
 *                   $ref: '#/components/schemas/StudyPlan'
 *       404:
 *         description: Study plan not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/study-plan/{id}:
 *   delete:
 *     tags: [Study Plans]
 *     summary: Delete study plan
 *     description: Delete a study plan and all associated resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Study plan ID
 *     responses:
 *       200:
 *         description: Study plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Study plan not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/agent/chat:
 *   post:
 *     tags: [Agents]
 *     summary: Chat with AI tutor or generate quiz
 *     description: Send a message to the AI tutor or request quiz generation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studyPlanId
 *               - message
 *               - mode
 *             properties:
 *               studyPlanId:
 *                 type: string
 *                 format: uuid
 *               message:
 *                 type: string
 *                 example: Explain gradient descent in simple terms
 *               mode:
 *                 type: string
 *                 enum: [chat, quiz]
 *                 example: chat
 *     responses:
 *       200:
 *         description: Response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     mode:
 *                       type: string
 *                       example: chat
 *                     response:
 *                       type: string
 *                     chatHistory:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ChatMessage'
 *                 - type: object
 *                   properties:
 *                     mode:
 *                       type: string
 *                       example: quiz
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/QuizQuestion'
 *       400:
 *         description: Study plan not completed or validation error
 *       404:
 *         description: Study plan not found
 */

/**
 * @swagger
 * /api/agent/chat/{studyPlanId}:
 *   get:
 *     tags: [Agents]
 *     summary: Get chat history
 *     description: Returns chat history for a specific study plan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studyPlanId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Chat history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatHistory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *                 total:
 *                   type: integer
 *       404:
 *         description: Study plan not found
 */

/**
 * @swagger
 * /api/resources:
 *   get:
 *     tags: [Resources]
 *     summary: Get resources
 *     description: Get resources by study plan ID or all user resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studyPlanId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Optional study plan ID to filter resources
 *     responses:
 *       200:
 *         description: Resources retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resources:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resource'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     tags: [Resources]
 *     summary: Get resource by ID
 *     description: Returns a specific resource with metadata
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resource retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resource:
 *                   $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Resource not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     tags: [Resources]
 *     summary: Delete resource
 *     description: Delete a specific resource
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Returns API health status
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 service:
 *                   type: string
 *                   example: StudyBuddy Backend
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */

export {}; // Make this a module
