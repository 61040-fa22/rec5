import express, { Request, Response } from 'express';
import Users from '../models/user';


// example middleware: returns an error if the user's username starts with a
const isUsernameGood = async (req: Request, res: Response, next: express.NextFunction) => {
  if (req.session.userId ) {
    const user = await Users.findOneByUserId(req.session.userId);

    if (!user) {
      req.session.userId = undefined;
      res.status(401).json({
        error: {
          userNotFound: "This user no longer exists"
        }
      }).end();
      return;
    } else if (user.username.startsWith('a')) {
      res.status(401).json({
        error: {
          badUsername: "Your username starts with a letter I don't like"
        }
      }).end();
    }
  }
  next()
}


export { 
  isUsernameGood
};
