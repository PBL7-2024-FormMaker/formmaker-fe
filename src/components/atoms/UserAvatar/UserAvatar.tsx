import { forwardRef } from 'react';
import { FaUser } from 'react-icons/fa6';
import { Avatar, AvatarProps } from '@mantine/core';

interface UserAvatarProps extends AvatarProps {
  avatarUrl: string;
}

const AVATAR_SIZE = 38;

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ avatarUrl, ...props }: UserAvatarProps, ref) =>
    avatarUrl ? (
      <Avatar
        ref={ref}
        src={avatarUrl}
        size={AVATAR_SIZE}
        radius='xl'
        {...props}
        className='cursor-pointer shadow-whiteShadow'
      />
    ) : (
      <Avatar
        ref={ref}
        size={AVATAR_SIZE}
        radius='xl'
        {...props}
        className='cursor-pointer bg-malachite-50 shadow-whiteShadow'
      >
        <FaUser size={20} className='text-malachite-500' />
      </Avatar>
    ),
);
