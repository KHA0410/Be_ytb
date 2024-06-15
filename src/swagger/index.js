/**
 * @swagger
 * /user/get-user:
 *  get:
 *      description: responses
 *      tags: [User]
 *      responses:
 *          200: 
 *              description: success   
 */

/**
 * @swagger
 * /api/v1/user/updateUser/{id}:
 *  put:
 *      description: responses
 *      tags: [Video]
 *      parameters:
 *      - in: path
 *        name: id
 *      - in: path
 *        name: id
 * 
 *      - in: body
 *        name: user
 *        schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: number 
 *             userName:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *      responses:
 *          200: 
 *              description: res   
 */
