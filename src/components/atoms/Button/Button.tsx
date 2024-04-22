import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
} from '@mantine/core';

import { cn } from '@/utils';

type ButtonVariant = 'filled' | 'light' | 'outline' | 'subtle';

type ButtonColor = 'primary' | 'error' | 'gray';

export interface ButtonProps
  extends Omit<MantineButtonProps, 'style'>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: ForwardedRef<HTMLButtonElement>;
  title: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  className?: string;
}

export const Button = forwardRef(
  (buttonProps: ButtonProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => {
    const {
      ref,
      title,
      color = 'primary',
      variant = 'filled',
      className,
      ...props
    }: ButtonProps = buttonProps;
    const checkButtonType = () => {
      let buttonStyles;
      switch (true) {
        case color === 'primary':
          switch (true) {
            case variant === 'filled':
              buttonStyles =
                'bg-malachite-500 text-white hover:bg-malachite-600 hover:text-white';
              break;
            case variant === 'light':
              buttonStyles =
                'bg-malachite-50 text-malachite-500 hover:bg-malachite-100 hover:text-malachite-500';
              break;
            case variant === 'outline':
              buttonStyles =
                'border-malachite-500 bg-white text-malachite-500 hover:bg-malachite-50 hover:text-malachite-500';
              break;
            case variant === 'subtle':
              buttonStyles =
                'bg-transparent text-malachite-500 hover:bg-malachite-100 hover:text-malachite-500';
              break;
            default:
              break;
          }
          break;
        case color === 'error':
          switch (true) {
            case variant === 'filled':
              buttonStyles =
                'bg-red-500 text-white hover:bg-red-600 hover:text-white';
              break;
            case variant === 'light':
              buttonStyles =
                'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-500';
              break;
            case variant === 'outline':
              buttonStyles =
                'border-red-500 bg-white text-red-500 hover:bg-red-50 hover:text-red-500';
              break;
            case variant === 'subtle':
              buttonStyles =
                'bg-transparent text-red-500 hover:bg-red-100 hover:text-red-500';
              break;
            default:
              break;
          }
          break;
        case color === 'gray':
          switch (true) {
            case variant === 'filled':
              buttonStyles =
                'bg-gray-400 text-white hover:bg-gray-500 hover:text-white';
              break;
            case variant === 'light':
              buttonStyles =
                'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-600';
              break;
            case variant === 'outline':
              buttonStyles =
                'border-gray-600 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-600';
              break;
            case variant === 'subtle':
              buttonStyles =
                'bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-600';
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      return buttonStyles;
    };

    return (
      <MantineButton
        ref={forwardedRef || ref}
        className={cn(
          'px-3 py-1 font-medium disabled:opacity-50',
          checkButtonType(),
          className,
        )}
        {...props}
      >
        {title}
      </MantineButton>
    );
  },
);
