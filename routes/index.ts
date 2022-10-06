import express, { Request, Response } from 'express';

const router = express.Router();
const prefix = "/";

/* GET home page */
router.get('/', (req: Request, res: Response) => {
  res.render('index');
});

export { prefix, router };
