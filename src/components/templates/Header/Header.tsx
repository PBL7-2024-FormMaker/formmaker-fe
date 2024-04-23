import { IoIosLogOut } from 'react-icons/io';
import { IoPersonOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Anchor, Group, Image, Menu } from '@mantine/core';

import WhiteLogo from '@/assets/images/whitelogo.png';
import { UserAvatar } from '@/atoms/UserAvatar';
import { PATH } from '@/constants/routes';
import { Loader } from '@/molecules/Loader';
import { useGetMyProfileQuery } from '@/redux/api/userApi';
import { httpClient } from '@/utils';

const LOGO_HEIGHT = 60;

export const Header = () => {
  const { data: myProfile, isLoading } = useGetMyProfileQuery();

  const navigate = useNavigate();

  const handleLogout = () => {
    httpClient.logout();
    navigate(PATH.ROOT_PAGE);
  };

  return (
    <header className='bg-navy-500 flex h-[70px] flex-row items-center justify-between px-10'>
      <Anchor href={PATH.ROOT_PAGE}>
        <Image src={WhiteLogo} h={LOGO_HEIGHT} className='pb-2' />
      </Anchor>
      {!myProfile || isLoading ? (
        <Loader color='white' />
      ) : (
        <div>
          <Menu shadow='md' offset={5} position='bottom-end'>
            <Menu.Target>
              <UserAvatar avatarUrl={myProfile.avatarUrl ?? ''} />
            </Menu.Target>
            <Menu.Dropdown className='min-w-[230px]'>
              <Menu.Item className='p-3 font-medium text-gray-600 delay-100 ease-linear hover:bg-transparent'>
                <Group>
                  <UserAvatar avatarUrl={myProfile.avatarUrl ?? ''} />
                  <div className='flex gap-1'>
                    <span className='text-[15px] font-normal'>Hello,</span>
                    <span className='text-[15px] font-medium'>
                      {myProfile.username}
                    </span>
                  </div>
                </Group>
              </Menu.Item>
              <Menu.Item
                leftSection={<IoPersonOutline size={16} />}
                className='hover:bg-navy-50 gap-4 px-6 py-3 text-[15px] font-normal text-gray-600 delay-100 ease-linear hover:text-white'
                onClick={() => navigate(PATH.MY_ACCOUNT_PAGE)}
              >
                Account
              </Menu.Item>
              <Menu.Item
                leftSection={<IoIosLogOut size={16} />}
                className='hover:bg-navy-50 gap-4 px-6 py-3 text-[15px] font-normal text-gray-600 delay-100 ease-linear hover:text-white'
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )}
    </header>
  );
};
