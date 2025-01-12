const ApiResponse = (res, message, data = null, status = 200) => {
  return res.status(status).json({
    message,
    data,
  });
};

module.exports = ApiResponse;
