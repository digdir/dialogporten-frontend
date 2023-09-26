import { z } from "zod";

export type HelloWorldDto = {
  name: string;
};

export const helloWorldDTOSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      description: "Name of the world",
    }),
  }),
});
