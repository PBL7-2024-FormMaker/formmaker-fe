import { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import {
  ActionIcon,
  Box,
  FileButton,
  FileButtonProps as FileButtonmantine,
  Group,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import {
  ErrorMessage,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { Button } from '@/atoms/Button';
import { useUploadFleMutation } from '@/redux/api/fileAPI';
import { cn, toastify } from '@/utils';

import { ErrorResponse } from '../../../types';

interface FileButtonProps extends Omit<FileButtonmantine, 'form'> {
  classNameError?: string;
  handleChange: (
    elementId: string,
    elementFieldId: string,
    value: string,
  ) => void;
  classNameWrapper?: string;
  required?: boolean;
  elementFieldId?: string;
  elementId?: string;
  field: FieldInputProps<File | null>;
  form: {
    touched: Record<string, boolean>;
    errors: Record<string, string>;
    setFieldValue: (
      field: string,
      value: File | null,
      shouldValidate?: boolean,
    ) => Promise<void | FormikErrors<unknown>>;
  };
  meta: FieldMetaProps<string>;
}

export const FileButtonUpload = (props: FileButtonProps) => {
  const {
    field,
    handleChange,
    classNameWrapper,
    elementFieldId,
    elementId,
    form: { setFieldValue },
    classNameError,
    ...rest
  } = props;
  const [uploadFile, { isLoading: isLoadingUpload }] = useUploadFleMutation();
  useEffect(() => {
    if (field.value) {
      setFieldValue(field.name, field.value);
      return;
    }
    setFieldValue(field.name, null);
  }, [field.name, field.value]);

  const handleUpdateFile = (
    elementId: string,
    elementFieldId: string,
    value: File | null,
  ) => {
    if (value) {
      uploadFile(value).then((res) => {
        if ('data' in res) {
          handleChange(elementId, elementFieldId, res.data.data.url);
          return;
        }
        if (res.error as ErrorResponse)
          return toastify.displayError((res.error as ErrorResponse).message);
      });
    }
  };
  return (
    <div className={cn('flex flex-col', classNameWrapper)}>
      {!field.value && (
        <FileButton
          accept='.pdf, .doc, .docx, .txt'
          {...rest}
          onChange={(value: File | null) => {
            if (elementFieldId && elementId && value)
              handleUpdateFile(elementId, elementFieldId, value);
            setFieldValue(field.name, value);
          }}
        >
          {(props) => (
            <Button
              {...props}
              title='Upload file'
              className={cn({ 'mb-4': !field.value }, 'w-fit')}
            />
          )}
        </FileButton>
      )}
      <Box pos='relative'>
        <LoadingOverlay
          visible={isLoadingUpload}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue' }}
        />

        {field.value && (
          <Group className='min-h-[45px] items-start'>
            <Text>{field.value.name}</Text>
            <ActionIcon
              size={25}
              variant='filled'
              aria-label='Settings'
              color='red'
              onClick={() => {
                setFieldValue(field.name, null);
                if (elementFieldId && elementId)
                  handleChange(elementId, elementFieldId, '');
              }}
            >
              <IoMdClose style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
          </Group>
        )}
      </Box>
      <ErrorMessage
        name={field.name}
        render={(msg) => (
          <div className={cn('mt-1 text-xs text-red-600', classNameError)}>
            {msg}
          </div>
        )}
      />
    </div>
  );
};
