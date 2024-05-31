import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';

import DisabledFormIcon from '@/assets/images/disable-form.png';
import { useElementLayouts } from '@/contexts';
import { Loader } from '@/molecules/Loader';
import { FormRenderComponentForMobile } from '@/organisms/FormRenderComponent';
import { SubmissionConfirmationForMobile } from '@/organisms/SubmissionConfirmation';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { useCreateResponseMutation } from '@/redux/api/responseApi';
import { getFormAnswerFields } from '@/utils/seperates';

export const PublicPageForMobile = () => {
  const { id: formId } = useParams();

  const { data: formData, isLoading } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { elements } = useElementLayouts();

  const [createFormResponse, { isLoading: isLoadingCreateFormResponse }] =
    useCreateResponseMutation();

  const formResponse = useMemo(() => getFormAnswerFields(elements), [elements]);

  const handleCreateFormResponse = () => {
    if (!formResponse) return;
    return createFormResponse({ formId: formId!, payload: formResponse }).then(
      (res) => {
        if ('data' in res) {
          setIsSuccess(true);
          return;
        }
        setIsSuccess(false);
        return;
      },
    );
  };

  if (isLoading) {
    return <Loader type='oval' className='translate-y-[50vh]' />;
  }

  if (formData?.disabled === true || formData?.deletedAt !== null)
    return (
      <div className='text-sl flex min-h-screen items-start justify-center bg-navy-10 py-10'>
        <div className='flex h-fit w-[90%] flex-col justify-between gap-3 rounded-xl border-x-0 border-b-0 border-t-[25px] border-solid border-t-navy-500 bg-white px-6 py-8 shadow-lg'>
          <h2 className='text-[32px]'>{formData?.title}</h2>
          <span className='leading-7'>
            This form is no longer accepting submissions
          </span>
          <img
            src={DisabledFormIcon}
            className='h-[300px] w-[300px] self-center object-contain'
          />
        </div>
      </div>
    );

  return (
    <div className='flex min-h-screen items-center justify-center bg-navy-10 py-10'>
      {!isSuccess ? (
        <Formik
          validateOnBlur={true}
          validateOnChange={false}
          initialValues={{}}
          onSubmit={handleCreateFormResponse}
        >
          <Form className='h-full w-full'>
            <FormRenderComponentForMobile
              form={formData}
              isLoading={isLoadingCreateFormResponse}
            />
          </Form>
        </Formik>
      ) : (
        <SubmissionConfirmationForMobile />
      )}
    </div>
  );
};
