import express from 'express';
import { CustomRequest, authenticationController } from '../controllers/authenticationController';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import passport from 'passport';

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
  authenticationController.callback
);
authenticationRouter.get('/protected', ensureAuthenticated, (req, res, next) =>
  authenticationController.protectedEndpoint(req as CustomRequest, res).catch(next)
);

export { authenticationRouter };
