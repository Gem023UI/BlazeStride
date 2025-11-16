let filter;

const initFilter = async () => {
  if (!filter) {
    const Filter = (await import('bad-words')).default;
    filter = new Filter();
  }
  return filter;
};

export const validateReviewDescription = async (description) => {
  if (!description) {
    return { isValid: false, message: 'Review description is required' };
  }

  if (description.length < 10) {
    return { isValid: false, message: 'Review must be at least 10 characters' };
  }

  if (description.length > 1000) {
    return { isValid: false, message: 'Review cannot exceed 1000 characters' };
  }

  const badWordsFilter = await initFilter();
  if (badWordsFilter.isProfane(description)) {
    return { isValid: false, message: 'Review contains inappropriate language' };
  }

  return { isValid: true };
};