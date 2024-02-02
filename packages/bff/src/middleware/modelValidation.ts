import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { ServerCode } from "../enums/ServerCode";

// Middleware to validate the request body, query and params against a schema
const validateModel =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      res.status(ServerCode.BadRequest).json(error);
      return;
    }
  };

export { validateModel };
