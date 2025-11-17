let filter;

// Dynamically import bad-words
const initFilter = async () => {
  if (!filter) {
    const badWordsModule = await import('bad-words');
    // Try different ways to access the Filter constructor
    const Filter = badWordsModule.default || badWordsModule.Filter || badWordsModule;
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

  try {
    // Censor bad words automatically
    const badWordsFilter = await initFilter();
    const censoredDescription = badWordsFilter.clean(description);

    return { 
      isValid: true, 
      censoredDescription: censoredDescription 
    };
  } catch (error) {
    console.error("Bad words filter error:", error);
    // If bad-words fails, just return original description
    return { 
      isValid: true, 
      censoredDescription: description 
    };
  }
};