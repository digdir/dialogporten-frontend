import express, { Express, Response } from 'express';
import passport from 'passport';
import { CustomRequest, authenticationController } from './authenticationController';
import { ensureAuthenticated } from './ensureAuthenticated';

export const oidc = (app: Express) => {
  const authenticationRouter = express.Router();

  /* test endpoint */
  authenticationRouter.get('/ping', async (req: any, res: Response) => {
    res.json({
      message: 'pong'
    });
  });

  authenticationRouter.get('/fail', authenticationController.fail);
  authenticationRouter.get('/loggedout', authenticationController.loggedOut);
  authenticationRouter.get('/login', authenticationController.login);
  authenticationRouter.get('/logout', authenticationController.logout);
  authenticationRouter.get(
    '/cb',
    passport.authenticate('oidc', {
      failureRedirect: '/login',
    }),
    authenticationController.callback,
  );
  authenticationRouter.get('/protected', ensureAuthenticated, (req, res, next) =>
    authenticationController.protectedEndpoint(req as CustomRequest, res).catch(next),
  );

  app.use('/api', authenticationRouter);
};
