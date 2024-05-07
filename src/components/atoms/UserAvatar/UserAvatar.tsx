import { forwardRef } from 'react';
import { FaUser } from 'react-icons/fa6';
import { Avatar, AvatarProps } from '@mantine/core';

interface UserAvatarProps extends AvatarProps {
  avatarUrl: string;
  iconSize?: string;
}

const AVATAR_SIZE = 38;

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ avatarUrl, size, iconSize = '20', ...props }: UserAvatarProps, ref) =>
    avatarUrl ? (
      <Avatar
        ref={ref}
        src={avatarUrl}
        size={size || AVATAR_SIZE}
        radius='100%'
        {...props}
        className='cursor-pointer shadow-whiteShadow'
      />
    ) : (
      <Avatar
        ref={ref}
        size={size || AVATAR_SIZE}
        radius='100%'
        {...props}
        className='cursor-pointer bg-navy-10 shadow-whiteShadow'
      >
        <FaUser size={iconSize} className='text-navy-500' />
      </Avatar>
    ),
);
