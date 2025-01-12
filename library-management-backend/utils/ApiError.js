const ApiError = (req, res, message, status) => {
  const error = new Error(message);
  error.status = status;
  return res.status(status).json({ message: error.message });
};

module.exports = ApiError;
