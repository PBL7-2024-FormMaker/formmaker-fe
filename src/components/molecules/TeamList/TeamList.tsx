import { useState } from 'react';
import { HiRectangleGroup } from 'react-icons/hi2';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { RiFolderAddFill, RiTeamFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Collapse,
  Group,
  Menu,
  NavLink,
  Stack,
  Text,
} from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

import { defaultFormsParams } from '@/constants/defaultFormsParams';
import { useFormParams, useOverviewContext } from '@/contexts';
import { type ModalType, ModalTypes, TeamResponse } from '@/types';
import { cn } from '@/utils';

import { FolderList } from '../FolderList';
import { Loader } from '../Loader';

interface TeamListProps {
  teamList?: TeamResponse[];
  isLoading: boolean;
  setTeamName: (teamName: string) => void;
  setTeamId: (teamId: string) => void;
  setFolderName: (folderName: string) => void;
  setFolderId: (folderId: string) => void;
  folderName: string;
  folderId: string;
  modalType: ModalType | '';
  setModalType: (modalType: ModalType | '') => void;
}
export const TeamList = ({
  teamList = [],
  isLoading,
  setTeamName,
  setTeamId,
  setFolderName,
  setFolderId,
  folderName,
  folderId,
  modalType,
  setModalType,
}: TeamListProps) => {
  const {
    activeTeam,
    activeFolder,
    setActiveTeam,
    setActiveAllForms,
    setActiveFolder,
    setSelectedRecords,
  } = useOverviewContext();

  const navigate = useNavigate();

  const openModal = (type: ModalType) => setModalType(type);

  const closeModal = () => setModalType('');
  const { setParams, setCurrentPage } = useFormParams();
  const [activeCollapse, setActiveCollapse] = useState<string[]>([]);

  const handleActiveCollapse = (teamId: string) => {
    setActiveCollapse((prev) => {
      if (prev.includes(teamId)) return prev.filter((prev) => prev !== teamId);
      return [...prev, teamId];
    });
  };

  return (
    <Box className='flex flex-col justify-between gap-2'>
      {isLoading ? (
        <Loader color='blue' />
      ) : (
        teamList.map((team) => {
          const isActiveTeam = team.id === activeTeam && activeFolder === '';

          return (
            <Stack className='gap-2'>
              <Group
                key={uuidv4()}
                className={cn(
                  'group cursor-pointer justify-between gap-0 rounded-md pr-2 text-slate-600 hover:bg-slate-200',
                  {
                    'bg-slate-300 hover:bg-slate-300': isActiveTeam,
                  },
                )}
              >
                <NavLink
                  key={team.id}
                  className={cn(
                    'w-[85%] rounded-md text-slate-600 hover:bg-slate-200',
                    {
                      'bg-slate-300 hover:bg-slate-300': isActiveTeam,
                    },
                  )}
                  onClick={() => {
                    setActiveTeam(team.id);
                    setActiveAllForms(false);
                    setActiveFolder('');
                    setSelectedRecords([]);
                    setCurrentPage(1);
                    setParams({ ...defaultFormsParams, teamId: team.id });
                  }}
                  label={
                    <Group className='items-center'>
                      <Text className='text-sm font-semibold'>{team.name}</Text>
                      {team.folders.length > 0 &&
                        (activeCollapse.includes(team.id) ? (
                          <IoIosArrowUp
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActiveCollapse(team.id);
                            }}
                          />
                        ) : (
                          <IoIosArrowDown
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActiveCollapse(team.id);
                            }}
                          />
                        ))}
                    </Group>
                  }
                  active={isActiveTeam}
                  leftSection={
                    team.logoUrl ? (
                      <img
                        className='h-[20px] w-[20px] rounded-full object-cover'
                        src={team.logoUrl}
                      />
                    ) : (
                      <RiTeamFill size={18} />
                    )
                  }
                />
                <Menu position='bottom-start' withArrow trigger='click'>
                  <Menu.Target>
                    <Box className='flex'>
                      <PiDotsThreeOutlineVerticalFill
                        size={18}
                        className='cursor-pointer rounded-md text-slate-600 transition-all duration-[50ms] ease-linear'
                      />
                    </Box>
                  </Menu.Target>
                  <Menu.Dropdown className='min-w-[180px] !bg-navy-10'>
                    <Menu.Item
                      className='mb-1 mt-0.5 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
                      leftSection={<HiRectangleGroup />}
                      onClick={() => {
                        setActiveTeam(team.id);
                        navigate(`/teams/${team.id}`);
                      }}
                    >
                      Team workspace
                    </Menu.Item>
                    <Menu.Item
                      className='mb-1 mt-0.5 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
                      leftSection={<RiTeamFill />}
                      onClick={() => {
                        openModal(ModalTypes.MANAGE_TEAM);
                        setTeamId(team.id);
                      }}
                    >
                      Manage members
                    </Menu.Item>
                    <Menu.Item
                      className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
                      leftSection={<RiFolderAddFill />}
                      onClick={() => {
                        openModal(ModalTypes.CREATE_FOLDER);
                        setTeamId(team.id);
                      }}
                    >
                      Add new folder
                    </Menu.Item>
                    <Menu.Item
                      className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
                      leftSection={<MdEdit />}
                      onClick={() => {
                        openModal(ModalTypes.UPDATE_TEAM);
                        setTeamName(team.name);
                        setTeamId(team.id);
                      }}
                    >
                      Change name
                    </Menu.Item>
                    <Menu.Item
                      className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
                      leftSection={<MdDelete />}
                      onClick={() => {
                        openModal(ModalTypes.DELETE_TEAM);
                        setTeamId(team.id);
                      }}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
              {team.folders.length > 0 && activeCollapse.includes(team.id) && (
                <Collapse in={true}>
                  <Box className='pl-3'>
                    <FolderList
                      folderList={team.folders}
                      isLoading={isLoading}
                      openModal={openModal}
                      setFolderName={setFolderName}
                      setFolderId={setFolderId}
                      modalType={modalType}
                      closeModal={closeModal}
                      folderName={folderName}
                      folderId={folderId}
                      teamId={team.id}
                    />
                  </Box>
                </Collapse>
              )}
            </Stack>
          );
        })
      )}
    </Box>
  );
};
