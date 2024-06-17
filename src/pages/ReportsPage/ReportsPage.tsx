import { useEffect, useMemo, useState } from 'react';
import { BsDatabaseExclamation } from 'react-icons/bs';
import { FaCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Box, Group, List, LoadingOverlay, Stack, Text } from '@mantine/core';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { useGetResponsesByFormIdQuery } from '@/redux/api/responseApi';
import { ElementType } from '@/types';
import { formatDate } from '@/utils';

import { NotFoundPage } from '../NotFoundPage';

export interface StringProperties {
  [key: string]: string;
}

export type ResponseRow =
  | {
      id: string;
      createdAt: string;
    }
  | StringProperties;
export interface ResponseColumns {
  accessor: string;
  title: string;
  value: string[];
  elementId: string;
  options: string[];
  type: ElementType;
}

interface ElementCount {
  name: string;
  value: number;
}

interface ItemCount {
  name: string;
  count: number;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF0099',
  '#CC0033',
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const renderActiveShape = (props: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle!);
  const cos = Math.cos(-RADIAN * midAngle!);
  const sx = cx! + (outerRadius! + 10) * cos;
  const sy = cy! + (outerRadius! + 10) * sin;
  const mx = cx! + (outerRadius! + 30) * cos;
  const my = cy! + (outerRadius! + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius! + 8}
        outerRadius={outerRadius! + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 8}
        y={ey}
        textAnchor={textAnchor}
        fill='#333'
      >
        {(payload as unknown as ElementCount).name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * -1}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill='#999'
      >
        {`(Rate ${(percent! * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

export const ReportsPage = () => {
  const [columns, setcolumns] = useState<ResponseColumns[]>([
    {
      accessor: '',
      title: '',
      value: [''],
      elementId: '',
      options: [''],
      type: ElementType.FULLNAME,
    },
  ]);
  const [activeIndices, setActiveIndices] = useState<{ [key: number]: number }>(
    {},
  );

  const handlePieEnter = (index: number, pieIndex: number) => {
    setActiveIndices((prevState) => ({
      ...prevState,
      [pieIndex]: index,
    }));
  };

  const { formId } = useParams();
  const { data: form, isLoading } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );
  const { data: response, isFetching } = useGetResponsesByFormIdQuery({
    formId: formId!,
  });

  const rawRecords = response?.responses;

  const responseRows: ResponseRow[] | undefined = useMemo(
    () =>
      rawRecords?.map((record) => {
        const answers = record.formAnswers.reduce(
          (elementAnswersList, elementAnswers) => {
            const elementAnswer = {
              [`NameElement${elementAnswers.elementId}`]:
                elementAnswers.elementName,
              [`ValueElement${elementAnswers.elementId}`]:
                elementAnswers.answers
                  .map((fieldAnswer) => fieldAnswer.text)
                  .join(' '),
            };

            const fieldsAnswers = elementAnswers.answers.reduce(
              (answers) => ({
                ...answers,
              }),
              { ...elementAnswer },
            );
            return { ...elementAnswersList, ...fieldsAnswers };
          },
          {
            id: record.id,
            createdAt: formatDate(record.createdAt, 'MMM D, YYYY HH:mm:ss A'),
          },
        );
        return {
          ...answers,
        };
      }),
    [rawRecords],
  );

  useEffect(() => {
    if (isLoading || isFetching || !form || !response) {
      return;
    }

    const generateColumnAnswers = () =>
      response.elementIdAndNameList
        .map((elementIdAndName) => {
          const column: ResponseColumns = {
            accessor: `ValueElement${elementIdAndName.elementId}`,
            title: elementIdAndName.elementName,
            value: [],
            elementId: elementIdAndName.elementId,
            options: [],
            type: ElementType.FULLNAME,
          };

          responseRows?.forEach((responseRow) => {
            const key = column.accessor;
            column.value.push((responseRow as StringProperties)[key]);
          });

          const columnElement = form?.elements.find(
            (element) => element.id === column.elementId,
          );

          if (!columnElement) return undefined;

          column.type = columnElement.type;

          switch (columnElement.type) {
            case ElementType.SINGLE_CHOICE:
            case ElementType.MULTIPLE_CHOICE:
              column.options = columnElement.config.options.slice();
              if (columnElement.config.otherOption.isDisplayed) {
                column.options.push('Other');
              }
              break;
            case ElementType.DROPDOWN:
              column.options = columnElement.config.options.slice();
              break;
            case ElementType.SCALE_RATING:
              column.options = ['1', '2', '3', '4', '5'];
              break;
          }

          column.value = column.value.filter(
            (item) => item?.trim() !== '' && item !== undefined,
          );
          if (columnElement.type === ElementType.MULTIPLE_CHOICE) {
            column.value = column.value.flatMap((item) => item.split(', '));
          }

          return column;
        })
        .filter((column): column is ResponseColumns => column !== undefined);

    const columnAnswers = generateColumnAnswers();
    setcolumns(columnAnswers);
  }, [form, response]);

  if (!isLoading && formId && !form) {
    return <NotFoundPage />;
  }
  const chartType = [
    ElementType.SINGLE_CHOICE,
    ElementType.MULTIPLE_CHOICE,
    ElementType.DROPDOWN,
    ElementType.SCALE_RATING,
  ];
  const pieChartType = [ElementType.SINGLE_CHOICE, ElementType.DROPDOWN];
  const barChartType = [ElementType.SCALE_RATING, ElementType.MULTIPLE_CHOICE];

  const countElements = (arr: string[]): ElementCount[] => {
    const counter: { [key: string]: number } = {};
    arr.forEach((item) => {
      counter[item] = (counter[item] || 0) + 1;
    });

    const result: ElementCount[] = Object.entries(counter).map(
      ([name, value]) => ({ name, value }),
    );

    return result;
  };

  const countItems = (arr: string[]): ItemCount[] => {
    const counter: { [key: string]: number } = {};
    arr.forEach((item) => {
      counter[item] = (counter[item] || 0) + 1;
    });
    const result: ItemCount[] = Object.entries(counter).map(
      ([name, count]) => ({ name, count }),
    );
    return result;
  };

  function processData(column: ResponseColumns): ElementCount[] {
    const chartData: ElementCount[] = [];
    const diff = column.options.filter((item) => !column.value.includes(item));
    const diffArray = diff.map((item) => ({ name: item, value: 0 }));
    chartData.push(...countElements(column.value), ...diffArray);
    const lookup: { [key: string]: number } = {};
    column.options.forEach((name, index) => {
      lookup[name] = index;
    });
    chartData.sort((x, y) => lookup[x.name] - lookup[y.name]);

    return chartData;
  }

  function processItemData(column: ResponseColumns): ItemCount[] {
    const chartData: ItemCount[] = [];
    const diff = column.options.filter((item) => !column.value.includes(item));
    const diffArray = diff.map((item) => ({ name: item, count: 0 }));
    chartData.push(...countItems(column.value), ...diffArray);
    const lookup: { [key: string]: number } = {};
    column.options.forEach((name, index) => {
      lookup[name] = index;
    });
    chartData.sort((x, y) => lookup[x.name] - lookup[y.name]);

    return chartData;
  }

  if (response === undefined) return <div></div>;

  if (responseRows?.length == 0) {
    return (
      <Box className='h-screen'>
        <Box className='flex h-contentHeight w-full flex-col items-center justify-center gap-3 bg-navy-10 pt-10'>
          <BsDatabaseExclamation size={64} className='text-gray-500' />
          <span className='mb-8 text-lg text-gray-600'>No reports found.</span>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box pos='relative'>
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue' }}
        />

        <Stack className='mt-8 w-full scroll-m-1 items-center'>
          <Stack className='w-1/2 gap-8 p-4'>
            {columns.map((column, pieIndex) => {
              if (!chartType.includes(column.type)) {
                if (column.type === ElementType.FILE_UPLOAD)
                  return (
                    <Stack
                      key={column.elementId}
                      className='gap-0 rounded-md border border-solid border-slate-300 p-4'
                    >
                      <Text className='font-bold text-navy-500 '>
                        {column.title}
                      </Text>
                      <Text className='mb-3 text-sm text-slate-500'>{`${column.value.length} answers`}</Text>
                      <Stack className='max-h-[300px] gap-1 overflow-auto'>
                        {column.value.map((item, index) => (
                          <a key={index} href={item}>
                            {item}
                          </a>
                        ))}
                      </Stack>
                    </Stack>
                  );
                return (
                  <Stack
                    key={column.elementId}
                    className='gap-0 rounded-md border border-solid border-slate-300 p-4'
                  >
                    <Text className='font-bold text-navy-500 '>
                      {column.title}
                    </Text>
                    <Text className='mb-3 text-sm text-slate-500'>{`${column.value.length} answers`}</Text>
                    <List className='max-h-[300px] overflow-auto'>
                      {column.value.map((item, index) => (
                        <List.Item key={index} className=''>
                          {item}
                        </List.Item>
                      ))}
                    </List>
                  </Stack>
                );
              }
              if (
                pieChartType.includes(column.type) &&
                column.value.length > 0
              ) {
                return (
                  <Stack className='rounded-md border border-solid border-slate-300'>
                    <Text className='pl-4 pt-4 font-bold text-navy-500'>
                      {column.title}
                    </Text>
                    <Group className='justify-center'>
                      <PieChart width={450} height={300}>
                        <Pie
                          activeIndex={activeIndices[pieIndex]}
                          activeShape={renderActiveShape}
                          label={renderCustomizedLabel}
                          labelLine={false}
                          data={processData(column)}
                          cx={200}
                          cy={150}
                          outerRadius={80}
                          fill='#8884d8'
                          dataKey='value'
                          onMouseEnter={(_data, index) =>
                            handlePieEnter(index, pieIndex)
                          }
                        >
                          {processData(column).map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                      <Stack className='gap-1'>
                        {processData(column).map((entry, index) => (
                          <Group key={index}>
                            <FaCircle color={COLORS[index % COLORS.length]} />
                            <Text>{entry.name}</Text>
                          </Group>
                        ))}
                      </Stack>
                    </Group>
                  </Stack>
                );
              }
              if (barChartType.includes(column.type)) {
                return (
                  <Stack
                    key={column.elementId}
                    className='rounded-md border border-solid border-slate-300'
                  >
                    <Text className='pl-4 pt-4 font-bold text-navy-500'>
                      {column.title}
                    </Text>
                    <Group className='justify-center'>
                      <BarChart
                        width={600}
                        height={300}
                        data={processItemData(column)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        barSize={20}
                      >
                        <XAxis
                          dataKey='name'
                          scale='point'
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray='4 4' />
                        <Bar
                          dataKey='count'
                          fill='#3f72af'
                          background={{ fill: '#eee' }}
                        />
                      </BarChart>
                    </Group>
                  </Stack>
                );
              }
            })}
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
