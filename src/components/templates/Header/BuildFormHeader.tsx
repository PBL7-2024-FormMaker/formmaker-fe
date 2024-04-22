import { useEffect, useMemo, useRef, useState } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Anchor, Group, Image, Menu } from '@mantine/core';

import GreenLogo from '@/assets/images/greenlogo.png';
import { UserAvatar } from '@/atoms/UserAvatar';
import { PATH } from '@/constants/routes';
import { DEFAULT_FORM_TITLE, useBuildFormContext } from '@/contexts';
import { Loader } from '@/molecules/Loader';
import { useGetMyProfileQuery } from '@/redux/api/userApi';
import { cn, formatDate, httpClient } from '@/utils';

const LOGO_HEIGHT = 45;

export const BuildFormHeader = () => {
  const { data: myProfile, isLoading } = useGetMyProfileQuery();

  const {
    form,
    isEditForm,
    setForm,
    isPublishSection,
    currentTitle,
    setCurrentTitle,
  } = useBuildFormContext();

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const createdDate = useMemo(
    () => formatDate(form.createdAt, 'MMM D, YYYY h:mm A'),
    [form.createdAt],
  );

  const updatedDate = useMemo(
    () => formatDate(form.updatedAt, 'MMM D, YYYY h:mm A'),
    [form.updatedAt],
  );

  const handleLogout = () => {
    httpClient.logout();
    navigate(PATH.ROOT_PAGE);
  };

  useEffect(() => {
    if (isEditForm && form.title !== '') {
      setCurrentTitle(form.title);
    } else {
      setCurrentTitle(currentTitle);
    }
  }, [isEditForm, currentTitle, form.title, setCurrentTitle]);

  useEffect(() => {
    if (isEditForm) return;
    setForm((prevState) => ({
      ...prevState,
      title: currentTitle,
    }));
  }, [currentTitle, isEditForm, setForm]);

  return (
    <header
      className={cn(
        'relative flex h-[70px] flex-row items-center justify-between px-10 py-3',
      )}
    >
      <Anchor href={PATH.ROOT_PAGE} className='z-10'>
        <Image src={GreenLogo} h={LOGO_HEIGHT} />
      </Anchor>

      <div className='absolute left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-center'>
        <div className='flex max-w-[50%] items-center justify-between gap-0.5 text-xl font-bold'>
          <input
            ref={titleInputRef}
            value={currentTitle}
            onChange={(event) => {
              setCurrentTitle(event.target.value);
              setForm((prevState) => ({
                ...prevState,
                title: event.target.value,
              }));
            }}
            onFocus={() => {
              setIsEditingTitle(true);
            }}
            onBlur={() => {
              setIsEditingTitle(false);
              if (currentTitle === '') {
                setCurrentTitle(DEFAULT_FORM_TITLE);
              }
            }}
            className='min-w-14 overflow-hidden text-ellipsis whitespace-nowrap border-none text-center outline-none'
            style={{ width: `${currentTitle.length * 12}px` }}
          />
          {isPublishSection || isEditingTitle || (
            <MdOutlineModeEditOutline
              size={18}
              onClick={() => {
                titleInputRef.current?.focus();
                setIsEditingTitle(true);
              }}
              className='min-w-[5%]'
            />
          )}
        </div>
        <div className='text-[13px] text-malachite-500'>
          {isEditForm &&
            (form.updatedAt
              ? `Last updated at ${updatedDate}`
              : `Created at ${createdDate}`)}
        </div>
      </div>

      {!myProfile || isLoading ? (
        <Loader color='green' />
      ) : (
        <div className='flex flex-row gap-6'>
          <Menu shadow='sm' offset={5} position='bottom-end' withArrow>
            <Menu.Target>
              <UserAvatar avatarUrl={myProfile.avatarUrl} />
            </Menu.Target>
            <Menu.Dropdown className='min-w-[230px]'>
              <Menu.Item className='p-3 font-medium text-gray-600 delay-100 ease-linear hover:bg-transparent'>
                <Group>
                  <UserAvatar avatarUrl={myProfile.avatarUrl} />
                  <div className='flex gap-1'>
                    <span className='text-[14px] font-normal'>Hello,</span>
                    <span className='text-[14px] font-medium'>
                      {myProfile.username}
                    </span>
                  </div>
                </Group>
              </Menu.Item>
              <Menu.Item
                leftSection={<IoPersonOutline size={16} />}
                className='gap-4 px-6 py-3 text-[15px] font-normal text-gray-600 delay-100 ease-linear hover:bg-malachite-50 hover:text-malachite-500'
                onClick={() => navigate(PATH.MY_ACCOUNT_PAGE)}
              >
                Account
              </Menu.Item>
              <Menu.Item
                leftSection={<IoIosLogOut size={16} />}
                className='gap-4 px-6 py-3 text-[15px] font-normal text-gray-600 delay-100 ease-linear hover:bg-malachite-50 hover:text-malachite-500'
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
