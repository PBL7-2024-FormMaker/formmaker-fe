import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { useAddFormMemberMutation } from '@/redux/api/formApi';
import { ErrorResponse, JwtPayload } from '@/types';
import { toastify } from '@/utils';

import { LoadingPage } from '../LoadingPage';

export const SharingForm = () => {
  const { id: formId } = useParams();
  const params = useLocation();
  const navigate = useNavigate();

  const [addFormMember] = useAddFormMemberMutation();

  useEffect(() => {
    const token = new URLSearchParams(params.search).get('token');
    if (!token || !formId) {
      navigate('/');
      return;
    }
    const decoded = jwtDecode(token || '') as JwtPayload;
    if (!decoded.email) {
      navigate('/');
      return;
    }
    addFormMember({ id: formId, email: decoded.email }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess('You have joined this form successfully!');
        localStorage.removeItem('acceptUrl');
        navigate(`/build/${formId}`);
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  }, [params.search]);

  return <LoadingPage />;
};
