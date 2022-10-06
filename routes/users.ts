import express, { Request, Response } from 'express';

import Users from '../models/user';
import * as validator from './middleware';


const router = express.Router();
const prefix = "/api/users";


/**
 * Create a user account.
 * 
 * @name POST /api/users
 * 
 * @param {string} username - username of user 
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {400} - If username is already taken and when password or username
 *                 is not in correct format
 */
router.post(
  '/',
  async (req: Request, res: Response) => {
    const user = await Users.addOne(req.body.username, req.body.password);
    req.session.userId = user.id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`, 
      user: Users.constructUserResponse(user)
    }).end();
  }
);

/**
 * Get author details.
 * 
 * @name GET /api/users/:author?
 * 
 * @return {author: UserResponse} - An object with author details and freets
 * @throws {400} - If author is not a valid username
 *
 */
 router.get(
  '/:author?', 
  async (req: Request, res: Response) => {
    const author = await Users.findOneByUsername(req.params.author);
    const response = {
      author: Users.constructUserResponse(author),
    };
    res.status(200).json(response).end();
  }
);


/**
 * Update a user's profile.
 * 
 * @name PUT /api/users
 * 
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  async (req: Request, res: Response) => {
    let userId = req.session.userId ?? ""; // will not be an empty string since its validated in isUserLoggedIn
    const user = await Users.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.', 
      user: Users.constructUserResponse(user)
    }).end();
  }
);


/**
 * Delete a user.
 * 
 * @name DELETE /api/users
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  async (req: Request, res: Response) => {
    let userId = req.session.userId ?? ""; // will not be an empty string since its validated in isUserLoggedIn 
    await Users.deleteOne(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    }).end();  
  }
);


export { prefix, router };