import { useState } from 'react';
import { FaChartPie } from 'react-icons/fa';
import { FaTableCells } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Tabs } from '@mantine/core';

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
    <Box className='relative flex h-[50px] items-center justify-center gap-0 bg-navy-10 pl-10'>
      <Tabs
        color='#3a6aa4'
        variant='pills'
        value={selectedTabValue}
        classNames={{ tabLabel: 'uppercase' }}
        onChange={(value: string | null) => handleChangeTab(value)}
        className='relative'
      >
        <Tabs.List className='h-[50px] justify-center gap-0'>
          {tabList.map((tab, index) => (
            <Tabs.Tab
              key={index}
              value={tab.value}
              leftSection={tab.icon}
              className={`h-full min-w-40 rounded-[0] px-8 text-lg ${tab.value === selectedTabValue ? 'text-white' : 'text-black'} duration-150 hover:bg-activeTabBackground hover:text-white`}
            >
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Box>
  );
};
