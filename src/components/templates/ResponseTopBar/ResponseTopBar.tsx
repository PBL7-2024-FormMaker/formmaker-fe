import { useState } from 'react';
import { FaChartPie } from 'react-icons/fa';
import { FaTableCells } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Tabs } from '@mantine/core';

import { cn } from '@/utils';

export const ResponseTopBar = () => {
  const tabList = [
    { title: 'Submissions', value: '/', icon: <FaTableCells /> },
    { title: 'Reports', value: 'reports', icon: <FaChartPie /> },
  ];
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isReportsTab = pathname.includes('reports');
  const [selectedTabValue, setSelectedTabValue] = useState<string | null>(
    tabList[0].value,
  );

  const handleChangeTab = (value: string | null) => {
    if (value === tabList[0].value && isReportsTab) {
      setSelectedTabValue(value);
      navigate(pathname.replace('/reports', ''));
      return;
    }
    if (value === tabList[1].value && !isReportsTab) {
      setSelectedTabValue(value);
      navigate(pathname.concat(`/${value}`));
      return;
    }
  };

  return (
    <Box className='relative flex h-[50px] items-center justify-start gap-0 bg-white'>
      <Tabs
        color='#3F72AF'
        variant='pills'
        value={selectedTabValue}
        classNames={{ tabLabel: 'uppercase' }}
        onChange={(value: string | null) => handleChangeTab(value)}
        className='relative'
      >
        <Tabs.List className='ml-4 mt-4 h-[50px] justify-center gap-2'>
          {tabList.map((tab, index) => (
            <Tabs.Tab
              key={index}
              value={tab.value}
              leftSection={tab.icon}
              className={cn(
                'h-full min-w-40 rounded-md border-[1px] border-solid border-slate-500 to-navy-600 px-8 text-lg duration-150 hover:bg-activeTabBackground hover:text-white',
              )}
            >
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Box>
  );
};
