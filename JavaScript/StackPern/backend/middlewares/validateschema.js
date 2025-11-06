export function validateSchema(schema) {
  return (req, res, next) => {
    // Joi
    if (typeof schema.validate === "function") {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          errors: Array.isArray(error.details)
            ? error.details.map((detail) => detail.message)
            : [error.message],
        });
      }
      return next();
    }

    // Zod
    if (typeof schema.safeParse === "function") {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          errors: result.error.errors.map((err) => err.message),
        });
      }
      return next();
    }

    // Caso no reconocido
    return res.status(500).json({
      status: "error",
      message: "Schema inválido: no es Joi ni Zod",
    });
  };
}