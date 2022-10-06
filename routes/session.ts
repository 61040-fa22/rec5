import express, { Request, Response } from 'express';

import Users from '../models/user';
import * as validator from './middleware';


const router = express.Router();
const prefix = "/api/session";


/**
 * Sign in user.
 * 
 * @name POST /api/session
 * 
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is wrong or not in the 
 *                 correct format
 *
 */
 router.post(
  '/', 
  [ 
    validator.isUsernameGood
  ], 
  async (req: Request, res: Response) => {
    const user = await Users.findOneByUsername(
      req.body.username
    );

    if (user) {
      req.session.userId = user.id.toString();
      res.status(201).json({
        message: 'You have logged in successfully',
        user: Users.constructUserResponse(user)
      }).end();
      
    } else {
      res.status(400).json({
        error: {
          password: 'You have entered an incorrect password'
        }
      }).end();
    }
  }
);

/**
 * Sign out a user
 * 
 * @name DELETE /api/session
 * 
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/',
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).send("You have been logged out successfully.");
  }
);

export { prefix, router };
