import * as yup from 'yup';

import { MESSAGES } from '@/constants/messages';
import { MINIMUM_PASSWORD_LENGTH, RULES } from '@/constants/rules';

export const usernameValidationSchema = yup.object({
  username: yup.string().trim().required(MESSAGES.REQUIRED_FIELD),
});

export const emailValidationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email(MESSAGES.INVALID_EMAIL)
    .required(MESSAGES.REQUIRED_FIELD),
});

export const passwordValidationSchema = yup.object({
  password: yup
    .string()
    .required(MESSAGES.REQUIRED_FIELD)
    .min(MINIMUM_PASSWORD_LENGTH, MESSAGES.PASSWORD_AT_LEAST_EIGHT_CHARACTERS)
    .matches(RULES.PASSWORD_REGEX, MESSAGES.VALID_PASSWORD_RULE),
  newPassword: yup
    .string()
    .required(MESSAGES.REQUIRED_FIELD)
    .min(MINIMUM_PASSWORD_LENGTH, MESSAGES.PASSWORD_AT_LEAST_EIGHT_CHARACTERS)
    .matches(RULES.PASSWORD_REGEX, MESSAGES.VALID_PASSWORD_RULE),
  confirmPassword: yup
    .string()
    .required(MESSAGES.REQUIRED_FIELD)
    .min(MINIMUM_PASSWORD_LENGTH, MESSAGES.PASSWORD_AT_LEAST_EIGHT_CHARACTERS)
    .matches(RULES.PASSWORD_REGEX, MESSAGES.VALID_PASSWORD_RULE)
    .oneOf([yup.ref('newPassword')], MESSAGES.PASSWORDS_DO_NOT_MATCH),
});

export const organizationNameValidationSchema = yup.object({
  organizationName: yup.string().trim().nullable(),
});
