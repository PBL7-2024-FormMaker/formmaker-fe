import { IoChevronForwardCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { UserAvatar } from '@/atoms/UserAvatar';
import {
  BuildFormContextProvider,
  ElementLayoutProvider,
  FormParamsProvider,
  useOverviewContext,
} from '@/contexts';
import { ActionToolbar } from '@/organisms/ActionToolbar';
import { Chatbot } from '@/organisms/ChatBot';
import { FormsTable } from '@/organisms/FormsTable';
import { OverviewSidebar } from '@/organisms/OverviewSidebar';
import { useGetTeamDetailsQuery } from '@/redux/api/teamApi';
import { Header } from '@/templates/Header';

export const OverviewPage = () => {
  const navigate = useNavigate();
  const { selectedRecords } = useOverviewContext();
  const { activeTeam, setActiveTeam } = useOverviewContext();
  const { data: team } = useGetTeamDetailsQuery(
    { id: activeTeam || '' },
    { skip: !activeTeam },
  );
  const [
    openedModalCreateForm,
    { open: openModalCreateForm, close: closeModalCreateForm },
  ] = useDisclosure(false);

  return (
    <FormParamsProvider>
      <Box className='h-screen'>
        <Header />
        <Box className='flex h-full w-full items-start justify-between gap-0'>
          <Stack className='h-full w-[20%] border-y-0 border-l-0 border-r border-solid border-slate-300'>
            <BuildFormContextProvider>
              <OverviewSidebar
                openModalCreateForm={openModalCreateForm}
                openedModalCreateForm={openedModalCreateForm}
                closeModalCreateForm={closeModalCreateForm}
              />
            </BuildFormContextProvider>
          </Stack>
          <Stack className='relative h-full w-[80%] gap-0'>
            {selectedRecords.length !== 0 ||
              (team && activeTeam && (
                <Group className='absolute left-5 top-7'>
                  <UserAvatar
                    size='20'
                    iconSize='10'
                    avatarUrl={team.logoUrl || ''}
                  />
                  <div
                    className='cursor-pointer text-sm'
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    {team.name}
                  </div>
                  <Box className='group flex h-6 items-center justify-center gap-1 rounded-full bg-navy-100 px-2 py-0.5'>
                    <Badge
                      className='m-0 cursor-pointer bg-inherit py-2 text-xs font-normal normal-case text-white'
                      rightSection={<IoChevronForwardCircle />}
                      onClick={() => {
                        setActiveTeam(team.id);
                        navigate(`/teams/${team.id}`);
                      }}
                    >
                      Team workspace
                    </Badge>
                  </Box>
                </Group>
              ))}
            <ActionToolbar
              selectedFormIds={selectedRecords.map(({ id }) => id)}
            />
            <FormsTable />
            <BuildFormContextProvider>
              <ElementLayoutProvider>
                <Chatbot closeModalCreateForm={closeModalCreateForm} />
              </ElementLayoutProvider>
            </BuildFormContextProvider>
          </Stack>
        </Box>
      </Box>
    </FormParamsProvider>
  );
};
