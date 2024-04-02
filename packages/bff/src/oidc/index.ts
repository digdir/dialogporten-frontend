import express, { Express } from 'express';
import passport from 'passport';
import { CustomRequest, authenticationController } from './authenticationController';
import { ensureAuthenticated } from './ensureAuthenticated';

export const oidc = (app: Express) => {
  const authenticationRouter = express.Router();

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

  app.use('/auth', authenticationRouter);
};
