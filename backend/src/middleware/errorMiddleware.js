const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: "Invalid data provided",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "An account with this information already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong on the server"
        : error.message,
  });
};

export { notFound, errorHandler };