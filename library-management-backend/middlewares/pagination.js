const pagination = (req, res, next) => {
  const resource = res.locals.resource;
  if (!Array.isArray(resource)) {
    return next(new Error("Resource for pagination must be an array"));
  }

  const { page, limit } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const lim = parseInt(limit, 10) || 10;

  if (
    (page && isNaN(pageNum)) ||
    (limit && isNaN(lim)) ||
    pageNum <= 0 ||
    lim <= 0
  ) {
    return res.status(400).json({ message: "Invalid query parameters" });
  }

  const totalPages = Math.ceil(resource.length / lim);
  const startIndex = (pageNum - 1) * lim;
  const endIndex = startIndex + lim;

  const results = resource.slice(startIndex, endIndex);

  const paginationResult = {
    results,
    totalPages,
    totalResults: resource.length,
    currentPage: pageNum,
    nextPage: getNextPage(pageNum, totalPages),
    prevPage: getPrevPage(pageNum),
  };

  res.paginationResult = paginationResult;
  res.json(paginationResult);
};

function getNextPage(currentPage, totalPages) {
  return currentPage >= totalPages ? null : currentPage + 1;
}

function getPrevPage(currentPage) {
  return currentPage <= 1 ? null : currentPage - 1;
}

module.exports = pagination;
