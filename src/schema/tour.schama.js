// import { z } from "zod";
const { z } = require("zod");

const tourSchemaValidation = z
  .object({
    name: z
      .string({
        required_error: "A tour must have a name containing 4-36 letters",
        invalid_type_error: "Name must be a string.",
      })
      .trim()
      .min(4, { message: "A tour's name must be at least Four letters." })
      .max(36, { message: "A tour's name must be less than 36 letters." }),

    duration: z.number({
      required_error: "A tour must have a duration",
      invalid_type_error: "Duration must be a number.",
    }),

    slug: z.string().optional(),

    maxGroupSize: z.number({
      required_error: "A tour must have a max Group Size",
      invalid_type_error: "maxGroupSize must be a number.",
    }),

    ratingsAverage: z
      .number()
      .min(1, { message: "A tour's rating must be above 1.0" })
      .max(5, { message: "A tour's rating must be below 5.0" }),

    ratingsCount: z.number(),

    price: z.number({
      required_error: "A tour must have a price",
      invalid_type_error: "price must be a number.",
    }),

    discount: z.number().optional(),

    summary: z
      .string({
        required_error: "A tour must have a summary",
        invalid_type_error: "summary must be a string.",
      })
      .trim(),

    description: z
      .string({
        required_error: "A tour must have a description",
        invalid_type_error: "description must be a string.",
      })
      .trim(),

    imageCover: z
      .string({
        required_error: "A tour must have a cover image",
        invalid_type_error: "imageCover must be a string.",
      })
      .trim(),

    images: z.array(z.string().trim()),
  })
  .refine(
    (data) => {
      if (data.discount) return data.discount < data.price;
      else return true;
    },
    {
      message: "Discount must be less than the price.",
    }
  );

exports.tourSchemaValidation = tourSchemaValidation;
