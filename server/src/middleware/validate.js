function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return res.status(400).json({ success: false, message: "Validation failed", errors: result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`) });
    req[source] = result.data;
    next();
  };
}
module.exports = { validate };
