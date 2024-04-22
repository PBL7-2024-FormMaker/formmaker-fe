import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Group,
  Input,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { useFormik } from 'formik';

import { Button } from '@/atoms/Button';
import { MESSAGES } from '@/constants/messages';
import { UserInfoItem } from '@/molecules/UserInfoItem';
import { useUploadImageMutation } from '@/redux/api/imageApi';
import {
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from '@/redux/api/userApi';
import { Header } from '@/templates/Header';
import { ErrorResponse, type ImageType, UploadImage } from '@/types';
import {
  emailValidationSchema,
  organizationNameValidationSchema,
  passwordValidationSchema,
  toastify,
  usernameValidationSchema,
} from '@/utils';

enum UserProfileFields {
  USERNAME = 'username',
  AVATAR = 'avatar',
  PASSWORD = 'password',
  NEW_PASSWORD = 'newPassword',
  CONFIRM_PASSWORD = 'confirmPassword',
  EMAIL = 'email',
  ORGANIZATION_NAME = 'organizationName',
  ORGANIZATION_LOGO = 'organizationLogo',
}

interface CurrentImages {
  avatarUrl: string;
  organizationLogo: string;
}

const emptyInitialValues = {
  username: '',
  email: '',
  password: '',
  newPassword: '',
  confirmPassword: '',
  organizationName: '',
};

export const AccountPage = () => {
  const { data: myProfile } = useGetMyProfileQuery();

  const [
    updateProfile,
    { isSuccess: isUpdateProfileSuccess, error: updateProfileError },
  ] = useUpdateProfileMutation();

  const [
    changePassword,
    { isSuccess: isChangePwSuccess, error: changePwError },
  ] = useChangePasswordMutation();

  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();

  const [editingFieldName, setEditingFieldName] = useState<string>('');

  const [selectedFile, setSelectedFile] = useState<File>();

  const [currentImages, setCurrentImages] = useState<CurrentImages>({
    avatarUrl: '',
    organizationLogo: '',
  });

  useEffect(() => {
    if (!myProfile) {
      setCurrentImages(() => ({
        avatarUrl: '',
        organizationLogo: '',
      }));
    } else {
      setCurrentImages(() => ({
        avatarUrl: myProfile.avatarUrl,
        organizationLogo: myProfile.organizationLogo,
      }));
    }
  }, [myProfile]);

  const handleEdit = (fieldName: string) => {
    setEditingFieldName(fieldName);
  };

  const handleCancelEdit = () => {
    setEditingFieldName('');
  };

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleChooseImage = (type: ImageType) =>
    type === UploadImage.AVATAR
      ? avatarInputRef.current?.click()
      : logoInputRef.current?.click();

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: ImageType,
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (!file.type.startsWith('image/')) {
      toastify.displayError(MESSAGES.ONLY_SUPPORT_IMAGE_FILE_TYPES);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Encoded = reader?.result?.toString() ?? '';
      if (type === UploadImage.AVATAR) {
        setCurrentImages((prev) => ({
          ...prev,
          avatarUrl: base64Encoded,
        }));
        handleEdit(UserProfileFields.AVATAR);
      } else {
        setCurrentImages((prev) => ({
          ...prev,
          organizationLogo: base64Encoded,
        }));
        handleEdit(UserProfileFields.ORGANIZATION_LOGO);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
    event.target.value = '';
  };

  const handleUpdateImage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: ImageType,
  ) => {
    event.preventDefault();
    if (selectedFile) {
      uploadImage(selectedFile).then((res) => {
        if ('data' in res) {
          type === UploadImage.AVATAR
            ? updateProfile({ avatarUrl: res.data.data.url })
            : updateProfile({ organizationLogo: res.data.data.url });
          handleCancelEdit();
          return;
        }
        if (res.error as ErrorResponse)
          toastify.displayError((res.error as ErrorResponse).message);
      });
    }
  };

  const handleRemoveImage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: ImageType,
  ) => {
    event.preventDefault();
    type === UploadImage.AVATAR
      ? updateProfile({ avatarUrl: '' })
      : updateProfile({ organizationLogo: '' });
    handleCancelEdit();
  };

  const getInitialValues = useMemo(() => {
    switch (editingFieldName) {
      case UserProfileFields.USERNAME:
        return {
          username: myProfile?.username ?? '',
        };
      case UserProfileFields.EMAIL:
        return {
          email: myProfile?.email ?? '',
        };
      case UserProfileFields.PASSWORD:
        return {
          password: '',
          newPassword: '',
          confirmPassword: '',
        };
      case UserProfileFields.ORGANIZATION_NAME:
        return {
          organizationName: myProfile?.organizationName ?? '',
        };
      default:
        return emptyInitialValues;
    }
  }, [myProfile, editingFieldName]);

  const getValidationSchema = useMemo(() => {
    switch (editingFieldName) {
      case UserProfileFields.USERNAME:
        return usernameValidationSchema;
      case UserProfileFields.EMAIL:
        return emailValidationSchema;
      case UserProfileFields.PASSWORD:
        return passwordValidationSchema;
      case UserProfileFields.ORGANIZATION_NAME:
        return organizationNameValidationSchema;
      default:
        break;
    }
  }, [editingFieldName]);

  const { values, errors, touched, getFieldProps, handleSubmit } = useFormik({
    initialValues: getInitialValues,
    validationSchema: getValidationSchema,
    onSubmit: () => {
      switch (editingFieldName) {
        case UserProfileFields.USERNAME:
          updateProfile({
            username: values.username ?? undefined,
          });
          break;
        case UserProfileFields.EMAIL:
          updateProfile({
            email: values.email ?? undefined,
          });
          break;
        case UserProfileFields.PASSWORD:
          changePassword({
            currentPassword: values.password || '',
            newPassword: values.newPassword || '',
          });
          break;
        case UserProfileFields.ORGANIZATION_NAME:
          updateProfile({
            organizationName: values.organizationName ?? undefined,
          });
          break;
        default:
          break;
      }
    },
    enableReinitialize: true,
  });

  const userInfoItems = [
    {
      fieldName: UserProfileFields.USERNAME,
      content:
        editingFieldName === UserProfileFields.USERNAME ? (
          <form onSubmit={handleSubmit} className='flex w-1/2 flex-col gap-3'>
            <Input
              placeholder='Username'
              {...getFieldProps(UserProfileFields.USERNAME)}
              autoFocus
            />
            {errors.username && touched.username && (
              <Text className='text-xs text-red-500'>{errors.username}</Text>
            )}
            <Button title='Save' type='submit' />
          </form>
        ) : (
          <Text>{myProfile?.username}</Text>
        ),
      hasEditButton: true,
      isLastItem: false,
    },
    {
      fieldName: UserProfileFields.PASSWORD,
      content:
        editingFieldName === UserProfileFields.PASSWORD ? (
          <form onSubmit={handleSubmit} className='flex w-1/2 flex-col gap-3'>
            <PasswordInput
              placeholder='Current password'
              {...getFieldProps(UserProfileFields.PASSWORD)}
              autoFocus
            />
            {errors.password && touched.password && (
              <Text className='text-xs text-red-500'>{errors.password}</Text>
            )}
            <PasswordInput
              placeholder='New password'
              {...getFieldProps(UserProfileFields.NEW_PASSWORD)}
            />
            {errors.newPassword && touched.newPassword && (
              <Text className='text-xs text-red-500'>{errors.newPassword}</Text>
            )}
            <PasswordInput
              placeholder='Confirm password'
              {...getFieldProps(UserProfileFields.CONFIRM_PASSWORD)}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text className='text-xs text-red-500'>
                {errors.confirmPassword}
              </Text>
            )}
            <Group>
              <Button title='Save' className='flex-1' type='submit' />
              <Button
                title='Cancel'
                color='gray'
                className='flex-1'
                onClick={handleCancelEdit}
              />
            </Group>
          </form>
        ) : (
          <Button
            title='Change password'
            onClick={() => handleEdit(UserProfileFields.PASSWORD)}
          />
        ),
      hasEditButton: false,
      isLastItem: false,
    },
    {
      fieldName: UserProfileFields.AVATAR,
      content:
        editingFieldName === UserProfileFields.AVATAR ? (
          <Group align='center'>
            <Box className='rounded-md bg-gray-100 p-1.5'>
              <Avatar
                size='md'
                variant='filled'
                radius='sm'
                src={currentImages.avatarUrl}
              />
            </Box>
            <input
              type='file'
              ref={avatarInputRef}
              onChange={(event) => handleImageChange(event, UploadImage.AVATAR)}
              className='hidden'
              accept='image/*'
            />
            <Button
              title='Save'
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => handleUpdateImage(event, UploadImage.AVATAR)}
              disabled={isUploadingImage}
            />
            <Button
              title='Cancel'
              color='gray'
              onClick={() => {
                setCurrentImages((prev) => ({
                  ...prev,
                  avatarUrl: myProfile?.avatarUrl ?? '',
                }));
                handleCancelEdit();
              }}
              disabled={isUploadingImage}
            />
          </Group>
        ) : (
          <Group>
            {myProfile?.avatarUrl ? (
              <Box className='rounded-md bg-gray-100 p-1.5'>
                <Avatar
                  size='md'
                  variant='filled'
                  radius='sm'
                  src={currentImages.avatarUrl}
                />
              </Box>
            ) : null}
            <input
              type='file'
              ref={avatarInputRef}
              onChange={(event) => handleImageChange(event, UploadImage.AVATAR)}
              className='hidden'
              accept='image/*'
            />
            {myProfile?.avatarUrl ? (
              <>
                <Button
                  title='Change avatar'
                  onClick={() => handleChooseImage(UploadImage.AVATAR)}
                />
                <Button
                  title='Remove'
                  variant='outline'
                  onClick={(event) => {
                    handleRemoveImage(event, UploadImage.AVATAR);
                  }}
                />
              </>
            ) : (
              <Button
                title='Upload avatar'
                onClick={() => handleChooseImage(UploadImage.AVATAR)}
              />
            )}
          </Group>
        ),
      hasEditButton: false,
      isLastItem: false,
    },
    {
      fieldName: UserProfileFields.EMAIL,
      content:
        editingFieldName === UserProfileFields.EMAIL ? (
          <form
            onSubmit={handleSubmit}
            className='flex w-1/2 flex-col justify-between gap-3'
          >
            <Input
              placeholder='Email'
              {...getFieldProps(UserProfileFields.EMAIL)}
              autoFocus
            />
            {errors.email && touched.email && (
              <Text className='text-xs text-red-500'>{errors.email}</Text>
            )}
            <Button title='Save' type='submit' />
          </form>
        ) : (
          <Text>{myProfile?.email}</Text>
        ),
      hasEditButton: true,
      isLastItem: false,
    },
    {
      fieldName: UserProfileFields.ORGANIZATION_NAME,
      content:
        editingFieldName === UserProfileFields.ORGANIZATION_NAME ? (
          <form onSubmit={handleSubmit} className='flex w-1/2 flex-col gap-3'>
            <Input
              placeholder='Organization name'
              {...getFieldProps(UserProfileFields.ORGANIZATION_NAME)}
              autoFocus
            />
            {errors.organizationName && touched.organizationName && (
              <Text className='text-xs text-red-500'>
                {errors.organizationName}
              </Text>
            )}
            <Button title='Save' type='submit' />
          </form>
        ) : (
          <Text>{myProfile?.organizationName}</Text>
        ),
      hasEditButton: true,
      isLastItem: false,
    },
    {
      fieldName: UserProfileFields.ORGANIZATION_LOGO,
      content:
        editingFieldName === UserProfileFields.ORGANIZATION_LOGO ? (
          <Group align='center'>
            <Box className='rounded-md bg-gray-100 p-1.5'>
              <Avatar
                size='md'
                variant='filled'
                radius='sm'
                src={currentImages.organizationLogo}
              />
            </Box>
            <input
              type='file'
              ref={logoInputRef}
              onChange={(event) => handleImageChange(event, UploadImage.LOGO)}
              className='hidden'
              accept='image/*'
            />
            <Button
              title='Save'
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => handleUpdateImage(event, UploadImage.LOGO)}
              disabled={isUploadingImage}
            />
            <Button
              title='Cancel'
              color='gray'
              onClick={() => {
                setCurrentImages((prev) => ({
                  ...prev,
                  organizationLogo: myProfile?.organizationLogo ?? '',
                }));
                handleCancelEdit();
              }}
              disabled={isUploadingImage}
            />
          </Group>
        ) : (
          <Group>
            {myProfile?.organizationLogo ? (
              <Box className='rounded-md bg-gray-100 p-1.5'>
                <Avatar
                  size='md'
                  variant='filled'
                  radius='sm'
                  src={currentImages.organizationLogo}
                />
              </Box>
            ) : null}
            <input
              type='file'
              ref={logoInputRef}
              onChange={(event) => handleImageChange(event, UploadImage.LOGO)}
              className='hidden'
              accept='image/*'
            />
            {myProfile?.organizationLogo ? (
              <>
                <Button
                  title='Change logo'
                  onClick={() => handleChooseImage(UploadImage.LOGO)}
                />
                <Button
                  title='Remove'
                  variant='outline'
                  onClick={(event) => {
                    handleRemoveImage(event, UploadImage.LOGO);
                  }}
                />
              </>
            ) : (
              <Button
                title='Add organization logo'
                onClick={() => handleChooseImage(UploadImage.LOGO)}
              />
            )}
          </Group>
        ),
      hasEditButton: false,
      isLastItem: true,
    },
  ];

  useEffect(() => {
    if (isUpdateProfileSuccess) {
      toastify.displaySuccess(MESSAGES.UPDATE_PROFILE_SUCCESS);
      handleCancelEdit();
    }
  }, [isUpdateProfileSuccess]);

  useEffect(() => {
    if (isChangePwSuccess) {
      toastify.displaySuccess(MESSAGES.CHANGE_PASSWORD_SUCCESS);
      handleCancelEdit();
    }
  }, [isChangePwSuccess]);

  useEffect(() => {
    if (updateProfileError) {
      toastify.displayError((updateProfileError as ErrorResponse).message);
    }
  }, [updateProfileError]);

  useEffect(() => {
    if (changePwError) {
      toastify.displayError((changePwError as ErrorResponse).message);
    }
  }, [changePwError]);

  return (
    <Stack className='h-max min-h-screen w-full gap-0 bg-malachite-500'>
      <Header />
      <Stack className='px-40 pb-8 pt-5'>
        <Stack className='items-center justify-center gap-12 rounded-xl bg-white px-14 py-7'>
          <Text className='text-center text-[26px] font-semibold'>
            Update Account and General Information
          </Text>
          <Stack className='w-full gap-5'>
            {userInfoItems.map((item, index) => (
              <UserInfoItem
                key={index}
                editingFieldName={editingFieldName}
                handleEdit={handleEdit}
                handleCancelEdit={handleCancelEdit}
                fieldName={item.fieldName}
                content={item.content}
                hasEditButton={item.hasEditButton}
                isLastItem={item.isLastItem}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
