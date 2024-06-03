import { useEffect, useMemo, useRef, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import { IoArrowBackCircle, IoPerson, IoPersonOutline } from 'react-icons/io5';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Badge,
  Box,
  Divider,
  Group,
  HoverCard,
  Image,
  LoadingOverlay,
  Menu,
  Stack,
} from '@mantine/core';
import { Field, Form, Formik } from 'formik';

import BlueLogo from '@/assets/images/bluelogo.png';
import { Button } from '@/atoms/Button';
import { UserAvatar } from '@/atoms/UserAvatar';
import { BIG_Z_INDEX } from '@/constants';
import { PATH } from '@/constants/routes';
import { DEFAULT_FORM_TITLE, useBuildFormContext } from '@/contexts';
import { Loader } from '@/molecules/Loader';
import { TextInput } from '@/molecules/TextInput';
import {
  useGetUsersInFormQuery,
  useInviteFormMemberMutation,
  useRemoveFormMemberMutation,
  useUpdateFormMutation,
} from '@/redux/api/formApi';
import { useGetTeamDetailsQuery } from '@/redux/api/teamApi';
import { useGetMyProfileQuery } from '@/redux/api/userApi';
import { ErrorResponse, FormResponse } from '@/types';
import { formatDate, httpClient, signUpSchema, toastify } from '@/utils';
import { separateFields } from '@/utils/seperates';

const LOGO_HEIGHT = 60;

const MAX_VISIBLE_USERS = 5;

const emailSchema = signUpSchema.pick(['email']);

export const BuildFormHeader = () => {
  const location = useLocation();
  const { activeTeam } = location.state || {};

  const { data: myProfile, isLoading } = useGetMyProfileQuery();

  const { form, isEditForm, isPublishSection, currentTitle, setCurrentTitle } =
    useBuildFormContext();

  const { data: usersInForm } = useGetUsersInFormQuery(
    { id: form.id || '' },
    { skip: !form.id },
  );

  const { data: team } = useGetTeamDetailsQuery(
    { id: activeTeam || '' },
    { skip: !activeTeam },
  );

  const creatorEmail = (usersInForm ?? []).find(
    (member) => (form as FormResponse)!.creatorId === member.id,
  )?.email;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [updateForm] = useUpdateFormMutation();
  const [removeFormMember, { isLoading: isRemoveMemberLoading }] =
    useRemoveFormMemberMutation();
  const [inviteFormMember, { isLoading: isInviteMemberLoading }] =
    useInviteFormMemberMutation();

  const createdDate = useMemo(
    () => formatDate(form.createdAt, 'MMM D, YYYY h:mm A'),
    [form.createdAt],
  );

  const updatedDate = useMemo(
    () => formatDate(form.updatedAt, 'MMM D, YYYY h:mm A'),
    [form.updatedAt],
  );

  const sortedUsers = usersInForm
    ? [...usersInForm].sort((firstVal, secondVal) => {
        if (
          firstVal.id === (form as FormResponse).creatorId &&
          secondVal.id !== (form as FormResponse).creatorId
        ) {
          return 1;
        } else if (
          firstVal.id !== (form as FormResponse).creatorId &&
          secondVal.id === (form as FormResponse).creatorId
        ) {
          return -1;
        } else {
          return 0;
        }
      })
    : [];

  const visibleUsers = sortedUsers.slice(0, MAX_VISIBLE_USERS);
  const hiddenUsers = sortedUsers.slice(MAX_VISIBLE_USERS);

  const handleLogout = () => {
    httpClient.logout();
    navigate(PATH.ROOT_PAGE);
  };

  const handleUpdateForm = (formId: string, title: string) => {
    const filteredForm = separateFields(form);
    if (!form.id) return;
    if (title === '') title = DEFAULT_FORM_TITLE;

    return updateForm({
      id: formId,
      data: {
        ...filteredForm,
        title,
      },
    }).then((res) => {
      if ('data' in res) {
        return;
      }
      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const handleInviteMemberToForm = (value: { email: string }) => {
    if (!form.id) return;

    inviteFormMember({ id: form.id, email: value.email }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data!.message as string);
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  const handleRemoveMemberToForm = (id: string) => {
    if (!form.id) return;

    removeFormMember({ id: form.id, memberIds: [id] }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data!.message as string);
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  useEffect(() => {
    setCurrentTitle(form.title);
  }, [form.title, setCurrentTitle]);

  return (
    <header className='relative flex h-[70px] flex-row items-center justify-between px-10'>
      <Anchor href={PATH.ROOT_PAGE} className='z-10'>
        <Image src={BlueLogo} h={LOGO_HEIGHT} className='pb-2' />
      </Anchor>

      <div className='absolute bottom-4 left-[15%] z-10 cursor-pointer'>
        <Box className='group flex h-6 items-center justify-center gap-1 rounded-full bg-navy-100 py-0.5'>
          <Badge
            className='m-0 bg-inherit py-2 text-xs font-normal normal-case text-white'
            leftSection={<IoArrowBackCircle size='16' />}
            onClick={() => {
              window.location.href = team ? `/teams/${team.id}` : '/overview';
            }}
          >
            {team ? 'Team workspace' : 'Back to home'}
          </Badge>
        </Box>
      </div>

      <div className='absolute left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-center'>
        <div className='flex max-w-[50%] items-center justify-between gap-0.5 text-xl font-bold'>
          <input
            ref={titleInputRef}
            value={currentTitle}
            onChange={(event) => {
              setCurrentTitle(event.target.value);
              setTimeout(() => {
                handleUpdateForm(form.id!, event.target.value);
              }, 2000);
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
            className='overflow-hidden text-ellipsis whitespace-nowrap border-none text-center outline-none'
            style={{ width: `${currentTitle.length * 18}px` }}
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
        <div className='text-[13px] text-navy-500'>
          {isEditForm &&
            (form.updatedAt
              ? `Last updated at ${updatedDate}`
              : `Created at ${createdDate}`)}
        </div>
      </div>

      {!myProfile || isLoading ? (
        <Loader color='blue' />
      ) : (
        <div className='flex flex-row items-center gap-6'>
          {myProfile.email === creatorEmail && (
            <>
              <div className='flex flex-row items-center gap-2'>
                {visibleUsers.map((member) => {
                  if (member.id !== (form as FormResponse).creatorId)
                    return (
                      !(form as FormResponse).teamId && (
                        <HoverCard shadow='md' withArrow position='bottom-end'>
                          <HoverCard.Target>
                            <UserAvatar avatarUrl={member.avatarUrl ?? ''} />
                          </HoverCard.Target>
                          <HoverCard.Dropdown className='flex flex-col items-start justify-start gap-2'>
                            <span className='text-[20px] font-semibold'>
                              {member.username}
                            </span>
                            <span className='text-[15px] font-medium text-gray-500'>
                              {member.email}
                            </span>
                            {myProfile.email === creatorEmail &&
                              member.id !==
                                (form as FormResponse).creatorId && (
                                <>
                                  <Divider className='my-2 w-full' />
                                  <Box pos='relative'>
                                    <LoadingOverlay
                                      visible={isRemoveMemberLoading}
                                      zIndex={1000}
                                      overlayProps={{ radius: 'sm', blur: 2 }}
                                      loaderProps={{
                                        color: 'blue',
                                        size: 'sm',
                                      }}
                                    />
                                    <Button
                                      variant='filled'
                                      title='Delete member'
                                      size='sm'
                                      className='w-full'
                                      onClick={() =>
                                        handleRemoveMemberToForm(member.id)
                                      }
                                    />
                                  </Box>
                                </>
                              )}
                          </HoverCard.Dropdown>
                        </HoverCard>
                      )
                    );
                })}

                {hiddenUsers.length > 0 && (
                  <Menu
                    shadow='md'
                    width={105}
                    opened={showMore}
                    onClose={() => setShowMore(false)}
                  >
                    <Menu.Target>
                      <Button
                        variant='outline'
                        onClick={() => setShowMore((prev) => !prev)}
                        className='my-2 ml-3 mr-8 min-w-[105px] text-xs font-medium'
                        title={
                          showMore
                            ? 'Show less'
                            : `Show ${hiddenUsers.length} more`
                        }
                      />
                    </Menu.Target>
                    <Menu.Dropdown>
                      {hiddenUsers.map((member) => (
                        <Menu.Item key={member.id}>
                          <HoverCard
                            shadow='md'
                            withArrow
                            position='left-start'
                            offset={20}
                          >
                            <HoverCard.Target>
                              <div className='flex w-full justify-center'>
                                <UserAvatar
                                  avatarUrl={member.avatarUrl ?? ''}
                                />
                              </div>
                            </HoverCard.Target>
                            <HoverCard.Dropdown className='flex flex-col items-start justify-start gap-2'>
                              <span className='text-[20px] font-semibold'>
                                {member.username}
                              </span>
                              <span className='text-[15px] font-medium text-gray-500'>
                                {member.email}
                              </span>
                              {myProfile.email === creatorEmail &&
                                member.id !==
                                  (form as FormResponse).creatorId && (
                                  <>
                                    <Divider className='my-2 w-full' />
                                    <Box pos='relative'>
                                      <LoadingOverlay
                                        visible={isRemoveMemberLoading}
                                        zIndex={1000}
                                        overlayProps={{ radius: 'sm', blur: 2 }}
                                        loaderProps={{
                                          color: 'blue',
                                          size: 'sm',
                                        }}
                                      />
                                      <Button
                                        variant='filled'
                                        title='Delete member'
                                        size='sm'
                                        className='w-full'
                                        onClick={() =>
                                          handleRemoveMemberToForm(member.id)
                                        }
                                      />
                                    </Box>
                                  </>
                                )}
                            </HoverCard.Dropdown>
                          </HoverCard>
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                )}
              </div>
              {!(form as FormResponse).teamId && (
                <>
                  <Menu
                    shadow='md'
                    offset={5}
                    position='bottom-end'
                    withArrow
                    classNames={{ dropdown: '!bg-navy-10 !border-none' }}
                  >
                    <Menu.Target>
                      <Button
                        title='Add collaborators'
                        variant='outline'
                        className='rounded-3xl'
                        leftSection={<IoPerson />}
                      />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Stack className='w-[660px] px-2 py-4'>
                        <Group>
                          <Box className='flex h-10 w-10 items-center justify-center rounded bg-navy-400'>
                            <FaLink size={20} className='text-white' />
                          </Box>
                          <Stack className='gap-0'>
                            <span className='text-base font-semibold text-blue-200'>
                              SHARE FORM
                            </span>
                            <span className='text-sm text-blue-100'>
                              Enter your co-worker's email to edit this form
                              simultaneously.
                            </span>
                          </Stack>
                        </Group>
                        <Formik
                          initialValues={{ email: '' }}
                          validateOnBlur={true}
                          validateOnChange={false}
                          validationSchema={emailSchema}
                          onSubmit={(value, { resetForm }) => {
                            handleInviteMemberToForm(value);
                            resetForm();
                          }}
                        >
                          <Form className='flex justify-between'>
                            <Field
                              name='email'
                              placeholder='Type email'
                              classNameWrapper='w-[75%]'
                              component={TextInput}
                            />
                            <Box pos='relative'>
                              <LoadingOverlay
                                visible={isInviteMemberLoading}
                                zIndex={BIG_Z_INDEX}
                                overlayProps={{ radius: 'sm', blur: 2 }}
                                loaderProps={{
                                  color: 'blue',
                                  size: 'sm',
                                }}
                              />
                              <Button
                                title='Invite member'
                                variant='filled'
                                color='orange'
                                type='submit'
                              />
                            </Box>
                          </Form>
                        </Formik>
                      </Stack>
                    </Menu.Dropdown>
                  </Menu>
                  <Divider orientation='vertical' />
                </>
              )}
            </>
          )}
          <Menu shadow='md' offset={5} position='bottom-end' withArrow>
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
                className='gap-4 px-6 py-3 text-[15px] font-normal text-gray-600 delay-100 ease-linear hover:bg-navy-50 hover:text-white'
                onClick={() => navigate(PATH.MY_ACCOUNT_PAGE)}
              >
                Account
              </Menu.Item>
              <Menu.Item
                leftSection={<IoIosLogOut size={16} />}
                className='gap-4 px-6 py-3 text-[15px] font-normal text-gray-600 delay-100 ease-linear hover:bg-navy-50 hover:text-white'
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
