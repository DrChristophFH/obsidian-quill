/**
 * Estimates the number of tokens in a text according to the formula
 * characters * (1 / e) + safteyMargin(characters) where e is the base of the natural logarithm
 * and safteyMargin is a linear function of the number of characters.
 * 
 * The formula is based on the stackoverflow answer https://stackoverflow.com/a/76416463
 * 
 * @param {string} text - The text to estimate the number of tokens for
 * @returns Estimated number of tokens
 */

export function estimateTokenCount(text: string) : number {
  const characters = text.length;
  return characters * 0.36787944117 + safteyMargin(characters);
}

/**
 * Linearly increasing saftey margin from 2 to 10 tokens for 1 to 2000 characters.
 * @param {number} characters - The number of characters in the text to estimate the saftey margin for
 * @returns saftey margin for the given number of characters
 */
function safteyMargin(characters: number) : number {
  return Math.round(characters * 0.004 + 2);
}
  