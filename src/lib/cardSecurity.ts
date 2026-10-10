/**
 * Card Security & Fraud Detection Engine for Pesapal Payment Processing
 * PCI-DSS Compliant: Zero persistence of raw PAN or CVV
 */

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface CardValidationResult {
  isValid: boolean;
  brand: CardBrand;
  errorMessage?: string;
  maskedCard?: string;
}

/**
 * Standard Luhn (MOD 10) Checksum Algorithm
 * Validates mathematical legitimacy of credit/debit card numbers globally.
 */
export function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (isNaN(digit)) return false;

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Identify Issuer Identification Number (IIN / BIN)
 */
export function detectCardBrand(cardNumber: string): CardBrand {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^(6011|65|64[4-9]|622)/.test(clean)) return 'discover';
  return 'unknown';
}

/**
 * Detect obvious fake, guessed, or repeating sequences
 */
function isDummyOrGuessedSequence(cleanDigits: string): boolean {
  // Check for all identical digits (e.g. 1111111111111111 or 0000000000000000)
  if (/^(\d)\1+$/.test(cleanDigits)) return true;

  // Check for sequential patterns (e.g. 1234567890123456)
  const sequentialAsc = '01234567890123456789';
  const sequentialDesc = '98765432109876543210';
  if (sequentialAsc.includes(cleanDigits) || sequentialDesc.includes(cleanDigits)) return true;

  return false;
}

/**
 * Validate Expiry Date (MM/YY or MM/YYYY)
 */
export function validateExpiry(expiryStr: string): { isValid: boolean; errorMessage?: string } {
  const clean = expiryStr.trim();
  const match = clean.match(/^(\d{1,2})\s*[\/\-]\s*(\d{2}|\d{4})$/);
  
  if (!match) {
    return { isValid: false, errorMessage: 'Please enter expiration date in MM/YY format.' };
  }

  const month = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);

  if (month < 1 || month > 12) {
    return { isValid: false, errorMessage: 'Please enter a valid expiration month (01–12).' };
  }

  // Normalize two-digit year to 20XX
  if (year < 100) {
    year += 2000;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, errorMessage: 'The card expiration date has expired. Please use an active card.' };
  }

  if (year > currentYear + 15) {
    return { isValid: false, errorMessage: 'The expiration date entered is beyond valid issuance range.' };
  }

  return { isValid: true };
}

/**
 * Validate CVV/CVC code
 */
export function validateCvv(cvv: string, brand: CardBrand): { isValid: boolean; errorMessage?: string } {
  const clean = cvv.trim();
  const requiredLength = brand === 'amex' ? 4 : 3;

  if (!new RegExp(`^\\d{${requiredLength}}$`).test(clean)) {
    return {
      isValid: false,
      errorMessage: `Please enter the ${requiredLength}-digit security code on your card.`,
    };
  }

  // Reject repeating numbers (e.g. 000, 999)
  if (/^(\d)\1+$/.test(clean)) {
    return { isValid: false, errorMessage: 'Invalid security code. Please check your card.' };
  }

  return { isValid: true };
}

/**
 * Comprehensive Card Validation & Fraud Filter
 */
export function validateCardDetails(
  cardNumber: string,
  cardholderName: string,
  expiry: string,
  cvv: string
): CardValidationResult {
  const cleanDigits = cardNumber.replace(/\D/g, '');

  // 1. Minimum digit check
  if (cleanDigits.length < 13 || cleanDigits.length > 19) {
    return {
      isValid: false,
      brand: 'unknown',
      errorMessage: 'The card number entered could not be verified. Please check the digits.',
    };
  }

  // 2. Reject obvious sequential/dummy patterns
  if (isDummyOrGuessedSequence(cleanDigits)) {
    return {
      isValid: false,
      brand: 'unknown',
      errorMessage: 'The card number is invalid or not recognized by card networks.',
    };
  }

  // 3. Detect Brand & BIN
  const brand = detectCardBrand(cleanDigits);
  if (brand === 'unknown') {
    return {
      isValid: false,
      brand: 'unknown',
      errorMessage: 'This card brand is not supported. Please use Visa, Mastercard, American Express, or Discover.',
    };
  }

  // 4. Validate exact length per brand
  if (brand === 'amex' && cleanDigits.length !== 15) {
    return {
      isValid: false,
      brand,
      errorMessage: 'American Express cards must have 15 digits.',
    };
  }
  if ((brand === 'visa' || brand === 'mastercard' || brand === 'discover') && cleanDigits.length !== 16) {
    return {
      isValid: false,
      brand,
      errorMessage: 'Please enter a complete 16-digit card number.',
    };
  }

  // 5. Luhn algorithm checksum
  if (!validateLuhn(cleanDigits)) {
    return {
      isValid: false,
      brand,
      errorMessage: 'The card number failed security checksum. Please check the digits and try again.',
    };
  }

  // 6. Cardholder Name Check
  const trimmedName = cardholderName.trim();
  const nameParts = trimmedName.split(/\s+/);
  if (nameParts.length < 2 || trimmedName.length < 4 || /[^a-zA-Z\s\.\-]/.test(trimmedName)) {
    return {
      isValid: false,
      brand,
      errorMessage: 'Please enter the cardholder full first and last name as printed on the card.',
    };
  }

  // 7. Expiry Check
  const expiryCheck = validateExpiry(expiry);
  if (!expiryCheck.isValid) {
    return {
      isValid: false,
      brand,
      errorMessage: expiryCheck.errorMessage,
    };
  }

  // 8. CVV Check
  const cvvCheck = validateCvv(cvv, brand);
  if (!cvvCheck.isValid) {
    return {
      isValid: false,
      brand,
      errorMessage: cvvCheck.errorMessage,
    };
  }

  const last4 = cleanDigits.slice(-4);
  const maskedCard = `•••• •••• •••• ${last4}`;

  return {
    isValid: true,
    brand,
    maskedCard,
  };
}

/**
 * Format card number with spaces for natural readability
 */
export function formatCardInput(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Format expiry input as MM/YY
 */
export function formatExpiryInput(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}
