export const calculatePaginationData = (count, perPage, page) => {
  const totalPages = Math.max(1, Math.ceil(count / perPage));
  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};
