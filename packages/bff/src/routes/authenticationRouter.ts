import express, { Response } from 'express';
import passport from 'passport';
import { CustomRequest, authenticationController } from '../oidc/authenticationController';
import { ensureAuthenticated } from '../oidc/ensureAuthenticated';

const authenticationRouter = express.Router();

authenticationRouter.get('/ping', async (req: any, res: Response, next: any) => {
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

export { authenticationRouter };
