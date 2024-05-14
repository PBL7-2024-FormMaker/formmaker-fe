import { useEffect, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  BackgroundImage,
  Box,
  Chip,
  Divider,
  HoverCard,
  LoadingOverlay,
  Stack,
} from '@mantine/core';
import { jwtDecode } from 'jwt-decode';

import bgImage from '@/assets/images/team-bg-image.png';
import { Button } from '@/atoms/Button';
import { UserAvatar } from '@/atoms/UserAvatar';
import { BIG_Z_INDEX } from '@/constants';
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
import {
  useAddMemberMutation,
  useGetTeamDetailsQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
} from '@/redux/api/teamApi';
import { useGetMyProfileQuery } from '@/redux/api/userApi';
import { Header } from '@/templates/Header';
import { ErrorResponse, JwtPayload, ModalType, ModalTypes } from '@/types';
import { toastify } from '@/utils';

import { LoadingPage } from '../LoadingPage';
import { NotFoundPage } from '../NotFoundPage';

export const TeamPage = () => {
  const params = useLocation();

  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  const [senderName, setSenderName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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

  const [modalType, setModalType] = useState<ModalType | ''>('');

  const { selectedRecords } = useOverviewContext();
  const { id: teamId } = useParams();
  const { data: myProfile } = useGetMyProfileQuery();
  const { data: team, isLoading } = useGetTeamDetailsQuery(
    { id: teamId || '' },
    { skip: !teamId },
  );

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

  const handleAcceptInvitation = () => {
    if (!teamId) return;

    addMember({ id: teamId, email }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess('You have joined this team successfully!');
        localStorage.removeItem('acceptUrl');
        navigate(`/teams/${teamId}`);
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
        toastify.displaySuccess(res.data.message as string);
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
        toastify.displaySuccess(res.data.message as string);
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!team) {
    return <NotFoundPage />;
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
              //TODO: update this to show and edit team's name and team's logo
            }
            <UserAvatar
              size='70'
              iconSize='35'
              avatarUrl={team.logoUrl ?? ''}
            />
            <span className='text-[20px] font-medium text-white'>
              {team.name}
            </span>
          </Box>
          {!viewInvitation && (
            <Box className='absolute right-10 top-5 flex items-center justify-center gap-4'>
              <Box className='flex items-center justify-center gap-2'>
                {membersInTeam
                  .sort((firstVal, secondVal) => {
                    if (firstVal.isOwner && !secondVal.isOwner) {
                      return 1;
                    } else if (!firstVal.isOwner && secondVal.isOwner) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
                  .map((member) => (
                    <HoverCard shadow='md' withArrow position='bottom-end'>
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
                        {myProfile!.email === creatorEmail &&
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
                                  onClick={() => handleRemoveMember(member.id)}
                                />
                              </Box>
                            </>
                          )}
                      </HoverCard.Dropdown>
                    </HoverCard>
                  ))}
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
        {viewInvitation ? (
          <Box className='relative flex h-full w-full justify-center bg-navy-10'>
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
          </Box>
        ) : (
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
              {
                //TODO: need to update to display only forms in team
              }
              <FormsTable />
            </Stack>
          </Box>
        )}
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
};
