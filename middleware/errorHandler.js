export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Zod Validation Errors
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      status: 'fail',
      errors: err.errors.map(e => ({ field: e.path[0], message: e.message }))
    });
  }

  // Handle Sequelize Unique Constraint Errors (e.g., duplicate email)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Email already exists'
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};