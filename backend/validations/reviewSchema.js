const badWordsList = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'dick', 'pussy', 'cock',
  'bastard', 'cunt', 'whore', 'slut', 'piss', 'fag', 'nigger', 'retard', 'tangina'
];

const containsBadWords = (text) => {
  const lowerText = text.toLowerCase();
  return badWordsList.some(word => {
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
    return regex.test(lowerText);
  });
};

export const validateReviewDescription = (description) => {
  if (!description) {
    return { isValid: false, message: 'Review description is required' };
  }

  if (description.length < 10) {
    return { isValid: false, message: 'Review must be at least 10 characters' };
  }

  if (description.length > 1000) {
    return { isValid: false, message: 'Review cannot exceed 1000 characters' };
  }

  if (containsBadWords(description)) {
    return { isValid: false, message: 'Review contains inappropriate language' };
  }

  return { isValid: true };
};