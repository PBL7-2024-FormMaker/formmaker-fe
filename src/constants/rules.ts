export const MINIMUM_PASSWORD_LENGTH = 8;

export const RULES = {
  PASSWORD_REGEX: /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
  PHONE_NUMBER_REGEX: /^(84|0)?(3|5|7|8|9)([0-9]{8})\b$/,
} as const;
