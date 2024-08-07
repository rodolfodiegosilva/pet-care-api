/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *         - clientType
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email (must be unique)
 *         password:
 *           type: string
 *           description: User's password (will be hashed)
 *         role:
 *           type: string
 *           description: Role of the user (e.g., client, supervisor, manager)
 *         clientType:
 *           type: string
 *           description: Type of client (e.g., new, active, inactive)
 *         pets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pet'
 *         healthPlan:
 *           $ref: '#/components/schemas/Plan'
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: hashedpassword
 *         role: client
 *         clientType: new
 *         pets: []
 *         healthPlan: null
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - breed
 *         - age
 *         - ownerId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the pet
 *         name:
 *           type: string
 *           description: Pet's name
 *         breed:
 *           type: string
 *           description: Pet's breed
 *         age:
 *           type: integer
 *           description: Pet's age
 *         ownerId:
 *           type: string
 *           description: ID of the pet's owner (a user)
 *       example:
 *         id: d5fE_asz
 *         name: Rex
 *         breed: Labrador
 *         age: 5
 *         ownerId: d5fE_asz
 *     Plan:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the plan
 *         name:
 *           type: string
 *           description: Plan's name (must be unique)
 *         price:
 *           type: number
 *           description: Plan's price (must be positive)
 *       example:
 *         id: d5fE_asz
 *         name: Gold Plan
 *         price: 99.99
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Product's name
 *         price:
 *           type: number
 *           description: Product's price (must be positive)
 *       example:
 *         id: d5fE_asz
 *         name: Dog Food
 *         price: 19.99
 *     Discount:
 *       type: object
 *       required:
 *         - name
 *         - percentage
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the discount
 *         name:
 *           type: string
 *           description: Discount's name
 *         percentage:
 *           type: number
 *           description: Discount percentage
 *       example:
 *         id: d5fE_asz
 *         name: Holiday Discount
 *         percentage: 10
 * paths:
 *   /auth/register:
 *     post:
 *       summary: Register a new user
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         201:
 *           description: User successfully registered
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         400:
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message
 *   /auth/login:
 *     post:
 *       summary: Login a user
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 password:
 *                   type: string
 *                   description: User's password
 *               example:
 *                 email: john.doe@example.com
 *                 password: password123
 *       responses:
 *         200:
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     description: JWT token
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         400:
 *           description: Invalid credentials
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message
 *   /auth/logout:
 *     post: 
 *       summary: Logout a user
 *       tags: [Auth]
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *           description: Bearer token
 *       responses:
 *         200:
 *           description: Logout successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *         400:
 *           description: Invalid token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message
 *   /users/{id}:
 *     get:
 *       summary: Get a user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       responses:
 *         200:
 *           description: User found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         404:
 *           description: User not found
 *     put:
 *       summary: Update a user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         200:
 *           description: User successfully updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         400:
 *           description: Bad request
 *         404:
 *           description: User not found
 *     delete:
 *       summary: Delete a user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       responses:
 *         200:
 *           description: User successfully deleted
 *         404:
 *           description: User not found
 *   /services:
 *     get:
 *       summary: Get all services
 *       tags: [Services]
 *       responses:
 *         200:
 *           description: List of all services
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Service'
 *   /services/{id}:
 *     get:
 *       summary: Get a service by ID
 *       tags: [Services]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Service ID
 *       responses:
 *         200:
 *           description: Service found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Service'
 *         404:
 *           description: Service not found
 *     put:
 *       summary: Update a service by ID
 *       tags: [Services]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Service ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       responses:
 *         200:
 *           description: Service successfully updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Service'
 *         400:
 *           description: Bad request
 *         404:
 *           description: Service not found
 *     delete:
 *       summary: Delete a service by ID
 *       tags: [Services]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Service ID
 *       responses:
 *         200:
 *           description: Service successfully deleted
 *         404:
 *           description: Service not found
 *   /products:
 *     get:
 *       summary: Get all products
 *       tags: [Products]
 *       responses:
 *         200:
 *           description: List of all products
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Product'
 *     post:
 *       summary: Create a new product
 *       tags: [Products]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       responses:
 *         201:
 *           description: Product successfully created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         400:
 *           description: Bad request
 *   /products/{id}:
 *     get:
 *       summary: Get a product by ID
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Product ID
 *       responses:
 *         200:
 *           description: Product found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         404:
 *           description: Product not found
 *     put:
 *       summary: Update a product by ID
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Product ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       responses:
 *         200:
 *           description: Product successfully updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         400:
 *           description: Bad request
 *         404:
 *           description: Product not found
 *     delete:
 *       summary: Delete a product by ID
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Product ID
 *       responses:
 *         200:
 *           description: Product successfully deleted
 *         404:
 *           description: Product not found
 *   /plans:
 *     get:
 *       summary: Get all plans
 *       tags: [Plans]
 *       responses:
 *         200:
 *           description: List of all plans
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Plan'
 *     post:
 *       summary: Create a new plan
 *       tags: [Plans]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       responses:
 *         201:
 *           description: Plan successfully created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Plan'
 *         400:
 *           description: Bad request
 *   /plans/{id}:
 *     get:
 *       summary: Get a plan by ID
 *       tags: [Plans]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Plan ID
 *       responses:
 *         200:
 *           description: Plan found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Plan'
 *         404:
 *           description: Plan not found
 *     put:
 *       summary: Update a plan by ID
 *       tags: [Plans]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Plan ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       responses:
 *         200:
 *           description: Plan successfully updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Plan'
 *         400:
 *           description: Bad request
 *         404:
 *           description: Plan not found
 *     delete:
 *       summary: Delete a plan by ID
 *       tags: [Plans]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Plan ID
 *       responses:
 *         200:
 *           description: Plan successfully deleted
 *         404:
 *           description: Plan not found
 *   /pets:
 *     get:
 *       summary: Get all pets
 *       tags: [Pets]
 *       responses:
 *         200:
 *           description: List of all pets
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Pet'
 *     post:
 *       summary: Register a new pet
 *       tags: [Pets]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       responses:
 *         201:
 *           description: Pet successfully registered
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Pet'
 *         400:
 *           description: Bad request
 *   /pets/{id}:
 *     get:
 *       summary: Get a pet by ID
 *       tags: [Pets]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Pet ID
 *       responses:
 *         200:
 *           description: Pet found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Pet'
 *         404:
 *           description: Pet not found
 *     put:
 *       summary: Update a pet by ID
 *       tags: [Pets]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Pet ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       responses:
 *         200:
 *           description: Pet successfully updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Pet'
 *         400:
 *           description: Bad request
 *         404:
 *           description: Pet not found
 *     delete:
 *       summary: Delete a pet by ID
 *       tags: [Pets]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Pet ID
 *       responses:
 *         200:
 *           description: Pet successfully deleted
 *         404:
 *           description: Pet not found
 *   /discounts:
 *     get:
 *       summary: Get all discounts
 *       tags: [Discounts]
 *       responses:
 *         200:
 *           description: List of all discounts
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Discount'
 *     post:
 *       summary: Propose a new discount
 *       tags: [Discounts]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       responses:
 *         201:
 *           description: Discount successfully proposed
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Discount'
 *         400:
 *           description: Bad request
 *   /discounts/{id}:
 *     get:
 *       summary: Get a discount by ID
 *       tags: [Discounts]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Discount ID
 *       responses:
 *         200:
 *           description: Discount found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Discount'
 *         404:
 *           description: Discount not found
 *     put:
 *       summary: Update a discount by ID
 *       tags: [Discounts]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Discount ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       responses:
 *         200:
 *           description: Discount successfully updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Discount'
 *         400:
 *           description: Bad request
 *         404:
 *           description: Discount not found
 *     delete:
 *       summary: Delete a discount by ID
 *       tags: [Discounts]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Discount ID
 *       responses:
 *         200:
 *           description: Discount successfully deleted
 *         404:
 *           description: Discount not found
 */
