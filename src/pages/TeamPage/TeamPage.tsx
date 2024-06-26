import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaCamera, FaCheck } from 'react-icons/fa';
import { IoIosAdd } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { useLocation, useParams } from 'react-router-dom';
import {
  BackgroundImage,
  Box,
  Chip,
  CloseButton,
  Divider,
  Group,
  HoverCard,
  LoadingOverlay,
  Menu,
  Stack,
} from '@mantine/core';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';

import bgImage from '@/assets/images/team-bg-image.png';
import { Button } from '@/atoms/Button';
import { UserAvatar } from '@/atoms/UserAvatar';
import { BACK_END_URL } from '@/configs';
import { BIG_Z_INDEX, MESSAGES, PATH } from '@/constants';
import {
  BuildFormContextProvider,
  FormParamsProvider,
  useOverviewContext,
} from '@/contexts';
import {
  getMembersInTeamWithOwnership,
  ManageMemberModal,
} from '@/molecules/ManageMemberModal';
import { ActionToolbar } from '@/organisms/ActionToolbar';
import { FormsTable } from '@/organisms/FormsTable';
import { OverviewTeamSidebar } from '@/organisms/OverviewSidebar';
import { useUploadImageMutation } from '@/redux/api/imageApi';
import {
  useAddMemberMutation,
  useGetTeamDetailsQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useUpdateTeamMutation,
} from '@/redux/api/teamApi';
import { useGetMyProfileQuery } from '@/redux/api/userApi';
import { Header } from '@/templates/Header';
import { ErrorResponse, JwtPayload, ModalType, ModalTypes } from '@/types';
import { toastify } from '@/utils';
import { canView } from '@/utils/checkPermissions';

import { LoadingPage } from '../LoadingPage';
import { NotFoundPage } from '../NotFoundPage';

const MAX_DISPLAYED_MEMBERS = 5;

const socket = io(BACK_END_URL);

export const TeamPage = () => {
  const params = useLocation();

  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  const [senderName, setSenderName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showMore, setShowMore] = useState<boolean>(false);
  const viewInvitation = new URLSearchParams(params.search).get(
    'view-invitation',
  );

  useEffect(() => {
    const token = new URLSearchParams(params.search).get('token');
    if (token) {
      const decoded = jwtDecode(token) as JwtPayload;
      setDecodedToken(decoded);
    }
  }, [params.search]);

  useEffect(() => {
    if (decodedToken) {
      setSenderName(decodedToken.senderName);
      setEmail(decodedToken.email);
    }
  }, [decodedToken]);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [modalType, setModalType] = useState<ModalType | ''>('');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string>('');
  const [currentLogo, setCurrentLogo] = useState<string>('');

  const { selectedRecords } = useOverviewContext();
  const { id: teamId } = useParams();
  const { data: myProfile } = useGetMyProfileQuery();

  const {
    data: team,
    isLoading,
    refetch,
  } = useGetTeamDetailsQuery({ id: teamId || '' }, { skip: !teamId });

  const membersInTeam =
    getMembersInTeamWithOwnership(team ? [team] : [], teamId) || [];
  const creatorEmail = membersInTeam.find(
    (member) => team!.creatorId === member.id,
  )?.email;

  const [inviteMember, { isLoading: isInviteMemberLoading }] =
    useInviteMemberMutation();
  const [removeMember, { isLoading: isRemoveMemberLoading }] =
    useRemoveMemberMutation();
  const [addMember, { isLoading: isAddMemberLoading }] = useAddMemberMutation();
  const [updateTeam, { isLoading: isUpdatingTeam }] = useUpdateTeamMutation();
  const [uploadImage, { isLoading: isUploadImage }] = useUploadImageMutation();
  const isLoadingOverlay = isUpdatingTeam || isUploadImage;

  const handleAcceptInvitation = () => {
    if (!teamId) return;

    addMember({ id: teamId, email }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess('You have joined this team successfully!');
        localStorage.removeItem('acceptUrl');
        window.location.href = `/teams/${teamId}`;
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  const handleInviteMember = (value: { email: string }) => {
    if (!teamId) return;

    inviteMember({ id: teamId, email: value.email }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data!.message as string);
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  const handleRemoveMember = (id: string) => {
    if (!teamId) return;

    removeMember({ id: teamId, memberIds: [id] }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data!.message as string);
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  const handleUpdateTeam = (teamId: string, teamName: string) => {
    updateTeam({ id: teamId, data: { name: teamName } }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data!.message as string);
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  const handleUpdateTeamWhenLogoChanged = (
    teamId: string,
    currentLogoFile?: File,
  ) => {
    if (!teamId || !team) return;
    if (currentLogoFile) {
      return uploadImage(currentLogoFile).then((imgRes) => {
        if ('data' in imgRes) {
          const logoUrl = imgRes.data!.data.url;

          return updateTeam({
            id: teamId,
            data: {
              name: team.name,
              logoUrl,
            },
          }).then((res) => {
            if ('data' in res) {
              toastify.displaySuccess(res.data!.message as string);
              return;
            }
            return toastify.displayError((res.error as ErrorResponse).message);
          });
        }

        return toastify.displayError((imgRes.error as ErrorResponse).message);
      });
    }

    return updateTeam({
      id: teamId,
      data: {
        name: team.name,
        logoUrl: '',
      },
    }).then((res) => {
      if ('data' in res) {
        return;
      }

      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (!file.type.startsWith('image/')) {
      toastify.displayError(MESSAGES.ONLY_SUPPORT_IMAGE_FILE_TYPES);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Encoded = reader?.result?.toString() ?? '';
      setCurrentLogo(base64Encoded);
    };
    if (file) {
      reader.readAsDataURL(file);
      handleUpdateTeamWhenLogoChanged(team!.id, file);
    }
    event.target.value = '';
  };

  const sortedMembers = membersInTeam.sort((firstVal, secondVal) => {
    if (firstVal.isOwner && !secondVal.isOwner) {
      return 1;
    } else if (!firstVal.isOwner && secondVal.isOwner) {
      return -1;
    } else {
      return 0;
    }
  });

  useEffect(() => {
    if (team) {
      setCurrentName(team.name);
      setCurrentLogo(team.logoUrl);
    }
  }, [team]);

  // Socket listener to re-fetch team data when 'teamMemberUpdate' event is received
  useEffect(() => {
    if (!team) return;

    socket.emit('joinRoom', team.id);

    socket.on('teamMemberUpdate', () => {
      // Fetch the team data again
      refetch();
    });

    return () => {
      socket.emit('leaveRoom', team.id);
      socket.off('teamMemberUpdate');
    };
  }, [team, refetch]);

  const displayedMembers = sortedMembers.slice(0, MAX_DISPLAYED_MEMBERS);
  const hiddenMembers = sortedMembers.slice(MAX_DISPLAYED_MEMBERS);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!team || !myProfile) {
    return <NotFoundPage />;
  }

  if (canView(myProfile.id, team.permissions)) {
    return (
      <FormParamsProvider>
        <Box className='h-screen'>
          <Header />
          <BackgroundImage
            src={bgImage}
            className='relative flex h-[200px] w-full items-center justify-center bg-navy-300'
          >
            <Box className='flex flex-col items-center justify-center gap-4'>
              {
                <Group className='relative w-[70px]'>
                  <input
                    type='file'
                    ref={logoInputRef}
                    onChange={(event) => handleLogoChange(event)}
                    accept='image/*'
                    className='hidden'
                  />
                  <div
                    className='relative cursor-default'
                    onClick={() => {
                      logoInputRef.current?.click();
                    }}
                  >
                    <Box pos='relative'>
                      <LoadingOverlay
                        visible={isLoadingOverlay}
                        zIndex={1000}
                        overlayProps={{
                          blur: 2,
                        }}
                        loaderProps={{
                          color: 'blue',
                          size: 'sm',
                        }}
                        classNames={{
                          overlay: 'w-[70px] h-[70px] rounded-full',
                        }}
                      />
                      <UserAvatar
                        size='70'
                        iconSize='35'
                        avatarUrl={currentLogo || ''}
                      />
                      {!currentLogo && (
                        <FaCamera
                          size='14'
                          color='white'
                          className='absolute bottom-0 right-0 cursor-pointer'
                        />
                      )}
                    </Box>
                  </div>
                  {currentLogo && (
                    <CloseButton
                      radius='lg'
                      size='xs'
                      icon={<IoClose size={14} />}
                      onClick={() => {
                        setCurrentLogo('');
                        handleUpdateTeamWhenLogoChanged(team.id, undefined);
                      }}
                      className='absolute -right-2 top-1 cursor-pointer bg-slate-200 p-0.5 text-slate-600 opacity-90 hover:bg-slate-300'
                    />
                  )}
                </Group>
              }
              <div className='flex min-h-[40px] items-center gap-0.5 text-white'>
                <input
                  ref={titleInputRef}
                  value={currentName || team.name}
                  onChange={(event) => {
                    setCurrentName(event.target.value);
                    if (currentName.length === 1) {
                      toastify.displayError('Team name cannot be empty!');
                      setCurrentName(team.name);
                    }
                  }}
                  onFocus={() => {
                    setIsEditingTitle(true);
                  }}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    if (currentName === '') {
                      toastify.displayError('Team name cannot be empty!');
                      setCurrentName(team.name);
                    }
                  }}
                  className='overflow-hidden text-ellipsis whitespace-nowrap border-none bg-transparent text-center text-xl font-bold text-white outline-none'
                  style={{ width: `${currentName.length * 25}px` }}
                />
                {isEditingTitle && team.name !== currentName ? (
                  <FaCheck
                    size={24}
                    onClick={() => {
                      handleUpdateTeam(team.id, currentName);
                      setIsEditingTitle(false);
                    }}
                    className='min-w-[5%] cursor-pointer font-bold'
                  />
                ) : (
                  <MdOutlineModeEditOutline
                    size={24}
                    onClick={() => {
                      titleInputRef.current?.focus();
                      setIsEditingTitle(true);
                    }}
                    className='min-w-[5%] cursor-pointer font-bold'
                  />
                )}
              </div>
            </Box>
            {!viewInvitation && (
              <Box className='absolute right-10 top-5 flex items-center justify-center gap-4'>
                <Box className='flex items-center justify-center gap-2'>
                  <Box className='flex items-center justify-center gap-2'>
                    {displayedMembers.map((member) => (
                      <HoverCard
                        shadow='md'
                        withArrow
                        position='bottom-end'
                        key={member.id}
                      >
                        <HoverCard.Target>
                          <UserAvatar
                            size='30'
                            iconSize='15'
                            avatarUrl={member.avatarUrl ?? ''}
                          />
                        </HoverCard.Target>
                        <HoverCard.Dropdown className='flex flex-col items-start justify-start gap-2'>
                          <span className='text-[20px] font-semibold'>
                            {member.username}
                          </span>
                          <span className='text-[15px] font-medium text-gray-500'>
                            {member.email}
                          </span>
                          <Chip variant='filled' checked={false}>
                            {member.isOwner ? 'Team owner' : 'Team member'}
                          </Chip>
                          {myProfile.email === creatorEmail &&
                            !member.isOwner && (
                              <>
                                <Divider className='my-2 w-full' />
                                <Box pos='relative'>
                                  <LoadingOverlay
                                    visible={isRemoveMemberLoading}
                                    zIndex={BIG_Z_INDEX}
                                    overlayProps={{ radius: 'sm', blur: 2 }}
                                    loaderProps={{ color: 'blue', size: 'sm' }}
                                  />
                                  <Button
                                    variant='filled'
                                    title='Delete member'
                                    size='sm'
                                    className='w-full'
                                    onClick={() =>
                                      handleRemoveMember(member.id)
                                    }
                                  />
                                </Box>
                              </>
                            )}
                        </HoverCard.Dropdown>
                      </HoverCard>
                    ))}
                  </Box>
                  {hiddenMembers.length > 0 && (
                    <Menu opened={showMore} onClose={() => setShowMore(false)}>
                      <Menu.Target>
                        <Button
                          variant='outline'
                          onClick={() => setShowMore((prev) => !prev)}
                          className='my-2 ml-3 mr-8 min-w-[105px] text-xs font-medium'
                          title={
                            showMore
                              ? 'Show less'
                              : `Show ${hiddenMembers.length} more`
                          }
                        />
                      </Menu.Target>
                      <Menu.Dropdown className='min-w-[105px]'>
                        {hiddenMembers.map((member) => (
                          <Menu.Item key={member.id} onClick={() => {}}>
                            <HoverCard
                              shadow='md'
                              withArrow
                              position='right-start'
                              offset={20}
                            >
                              <HoverCard.Target>
                                <div className='flex w-full justify-center'>
                                  <UserAvatar
                                    size='30'
                                    iconSize='15'
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
                                <Chip variant='filled' checked={false}>
                                  {member.isOwner
                                    ? 'Team owner'
                                    : 'Team member'}
                                </Chip>
                                {myProfile.email === creatorEmail &&
                                  !member.isOwner && (
                                    <>
                                      <Divider className='my-2 w-full' />
                                      <Box pos='relative'>
                                        <LoadingOverlay
                                          visible={isRemoveMemberLoading}
                                          zIndex={1000} // sử dụng zIndex phù hợp
                                          overlayProps={{
                                            radius: 'sm',
                                            blur: 2,
                                          }}
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
                                            handleRemoveMember(member.id)
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
                </Box>
                <Button
                  title='Invite'
                  variant='outline'
                  color='primary'
                  leftSection={<IoIosAdd size={16} />}
                  onClick={() => {
                    setModalType(ModalTypes.MANAGE_TEAM);
                  }}
                  className='my-2 text-xs font-medium uppercase'
                />
              </Box>
            )}
          </BackgroundImage>
          <Box className='flex h-full w-full items-start justify-between gap-0'>
            <Stack className='h-full w-[20%] border-y-0 border-l-0 border-r border-solid border-slate-300'>
              <BuildFormContextProvider>
                <OverviewTeamSidebar
                  isLoading={isLoading}
                  team={team}
                  modalType={modalType}
                  setModalType={setModalType}
                />
              </BuildFormContextProvider>
            </Stack>
            <Stack className='h-full w-[80%] gap-0'>
              <ActionToolbar
                selectedFormIds={selectedRecords.map(({ id }) => id)}
              />
              <FormsTable />
            </Stack>
          </Box>
        </Box>
        <ManageMemberModal
          teamList={[team!]}
          teamId={teamId || ''}
          opened={modalType === ModalTypes.MANAGE_TEAM}
          onClose={() => setModalType('')}
          handleInviteMember={handleInviteMember}
          handleRemoveMember={handleRemoveMember}
          isLoading={isInviteMemberLoading || isRemoveMemberLoading}
        />
      </FormParamsProvider>
    );
  }

  return (
    <FormParamsProvider>
      <Box className='h-screen'>
        <Header />
        <BackgroundImage
          src={bgImage}
          className='relative flex h-[200px] w-full items-center justify-center bg-navy-300'
        >
          <Box className='flex flex-col items-center justify-center gap-4'>
            {
              <Group className='relative w-[70px]'>
                <input
                  type='file'
                  ref={logoInputRef}
                  accept='image/*'
                  className='hidden'
                />
                <div className='relative cursor-default'>
                  <Box pos='relative'>
                    <LoadingOverlay
                      visible={isLoadingOverlay}
                      zIndex={1000}
                      overlayProps={{
                        blur: 2,
                      }}
                      loaderProps={{
                        color: 'blue',
                        size: 'sm',
                      }}
                      classNames={{
                        overlay: 'w-[70px] h-[70px] rounded-full',
                      }}
                    />
                    <UserAvatar
                      size='70'
                      iconSize='35'
                      avatarUrl={currentLogo || ''}
                    />
                  </Box>
                </div>
                {currentLogo && (
                  <CloseButton
                    radius='lg'
                    size='xs'
                    icon={<IoClose size={14} />}
                    className='absolute -right-2 top-1 cursor-pointer bg-slate-200 p-0.5 text-slate-600 opacity-90 hover:bg-slate-300'
                  />
                )}
              </Group>
            }
            <div className='flex min-h-[40px] items-center gap-0.5 text-white'>
              <input
                ref={titleInputRef}
                value={currentName || team.name}
                className='overflow-hidden text-ellipsis whitespace-nowrap border-none bg-transparent text-center text-xl font-bold text-white outline-none'
                style={{ width: `${currentName.length * 25}px` }}
              />
            </div>
          </Box>
        </BackgroundImage>
        <Box className='relative flex h-full w-full justify-center bg-navy-10'>
          {viewInvitation ? (
            <Box className='absolute top-[20%] flex flex-col items-center justify-center gap-10'>
              <span className='text-[24px]'>
                <span className='font-semibold text-blue-700'>
                  {senderName}
                </span>{' '}
                invited you to collaborate
              </span>
              <Box pos='relative'>
                <LoadingOverlay
                  visible={isAddMemberLoading}
                  zIndex={BIG_Z_INDEX}
                  overlayProps={{ radius: 'sm', blur: 2 }}
                  loaderProps={{ color: 'blue', size: 'sm' }}
                />

                <Button
                  title='Accept invitation'
                  size='lg'
                  className='w-[200px]'
                  onClick={() => handleAcceptInvitation()}
                />
              </Box>
            </Box>
          ) : (
            <Box className='absolute top-[20%] flex flex-col items-center justify-center gap-10'>
              <span className='text-[24px]'>
                You do not have the right to access this team!
              </span>
              <Box pos='relative'>
                <LoadingOverlay
                  visible={isAddMemberLoading}
                  zIndex={BIG_Z_INDEX}
                  overlayProps={{ radius: 'sm', blur: 2 }}
                  loaderProps={{ color: 'blue', size: 'sm' }}
                />

                <Button
                  title='Back to home'
                  size='lg'
                  className='w-[200px]'
                  onClick={() => {
                    window.location.href = PATH.OVERVIEW_PAGE;
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </FormParamsProvider>
  );
};
