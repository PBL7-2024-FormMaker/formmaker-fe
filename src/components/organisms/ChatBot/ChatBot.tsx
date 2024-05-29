import { useCallback, useEffect, useState } from 'react';
import {
  addLinkSnippet,
  addResponseMessage,
  renderCustomComponent,
  setQuickButtons,
  toggleMsgLoader,
  Widget,
} from 'react-chat-widget';
import { FaEye } from 'react-icons/fa';
import { Image, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Form, Formik } from 'formik';

import FormHolder from '@/assets/images/formholder.png';
import { Button } from '@/atoms/Button';
import { PATH } from '@/constants';
import { useElementLayouts } from '@/contexts';
import { useCreateFormMutation } from '@/redux/api/formApi';
import { useGetElementsFromQuestionMutation } from '@/redux/api/openAiApi';
import { ElementConfig, ElementType, FormResponse } from '@/types';
import { createElement } from '@/utils/elements';
import { separateFields } from '@/utils/seperates';

import { FormRenderComponent } from '../FormRenderComponent';

import 'react-chat-widget/lib/styles.css';

interface PreviewFormProps {
  form: FormResponse;
}

const buttons = [
  { label: 'Create form', value: 'create-form' },
  { label: 'Re-generate', value: 're-generate' },
];

const PreviewForm = ({ form }: PreviewFormProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className='relative flex h-[120px] w-[215px] items-center justify-center overflow-hidden rounded-md border border-solid border-gray-300 bg-[#f4f7f9]'>
        <Image src={FormHolder} className='absolute left-0 top-0 opacity-55' />
        <Button
          title={'preview form'}
          variant='filled'
          leftSection={<FaEye size={18} />}
          onClick={() => {
            open();
          }}
        />
      </div>
      <Modal
        title='Preview Form'
        opened={opened}
        onClose={close}
        size='xl'
        classNames={{
          inner: 'z-[10000] top-[80px]',
          content: 'pb-4 h-[700px]',
        }}
      >
        <Formik
          validateOnBlur={true}
          validateOnChange={false}
          initialValues={{}}
          onSubmit={() => {}}
        >
          <Form className='w-full'>
            <FormRenderComponent form={form} width='w-[90%]' />
          </Form>
        </Formik>
      </Modal>
    </>
  );
};

export const Chatbot = () => {
  const { elements } = useElementLayouts();
  const [filteredForm, setFilteredForm] = useState<FormResponse>(
    {} as FormResponse,
  );
  const [newMessage, setNewMessage] = useState<string>('');
  const [isCreated, setIsCreated] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chatWindowOpen, setChatWindowOpen] = useState(true);
  const [getElementsFromQuestion] = useGetElementsFromQuestionMutation();
  const [createForm] = useCreateFormMutation();

  const handleToggle = () => {
    setChatWindowOpen((prev) => !prev);
  };

  useEffect(() => {
    addResponseMessage(
      'Hello, please provide your request so I can assist you in creating the form.',
    );
  }, []);

  const handleSendMessageToAPI = useCallback(async (newMessage: string) => {
    try {
      const elementsResponse = await getElementsFromQuestion({
        questions: newMessage,
      }).unwrap();
      if ('data' in elementsResponse) {
        if (elementsResponse.data.form) {
          const newElements = elementsResponse.data.form[0].elements.map(
            (elementResponse: {
              elementType: ElementType;
              config: ElementConfig;
            }) =>
              createElement(
                elementResponse.elementType,
                elementResponse.config,
              ),
          );
          const elementsWithoutHeading = elements.filter(
            (elm) => elm.type !== ElementType.HEADING,
          );
          const filteredForm = separateFields({
            title: elementsResponse.data.form[0].title,
            logoUrl: '',
            settings: {},
            elements: [...elementsWithoutHeading, ...newElements],
            createdAt: '',
            updatedAt: '',
          });

          setFilteredForm(filteredForm);
          toggleMsgLoader();
          renderCustomComponent(PreviewForm, {
            form: filteredForm,
          });
          setQuickButtons(!isCreated ? buttons : []);
        } else {
          toggleMsgLoader();
          addResponseMessage(elementsResponse.data.message);
        }
      } else {
        toggleMsgLoader();
        addResponseMessage('Failed to read the request. Please try again');
      }
    } catch (error) {
      toggleMsgLoader();
      addResponseMessage('Failed to read the request. Please try again');
    }
  }, []);

  const handleNewUserMessage = async (newMessage: string) => {
    toggleMsgLoader();
    // Now send the message throught the backend API
    await handleSendMessageToAPI(newMessage);
  };

  const handleQuickButtonClicked = async (data: string) => {
    switch (data) {
      case 'create-form':
        toggleMsgLoader();
        try {
          createForm(filteredForm).then((res) => {
            if ('data' in res) {
              setIsCreated(true);
              addLinkSnippet({
                title: 'Your form link',
                link: `http://localhost:5173${PATH.BUILD_FORM_PAGE}/${res.data!.data.id}`,
                target: '_blank',
              });
              toggleMsgLoader();
              setQuickButtons([]);
            } else {
              toggleMsgLoader();
              addResponseMessage('Failed to create form. Please try again');
            }
          });
        } catch (error) {
          toggleMsgLoader();
          addResponseMessage('Failed to create form. Please try again');
        }
        break;
      case 're-generate':
        toggleMsgLoader();
        await handleSendMessageToAPI(newMessage);
        break;
      default:
        return;
    }
  };

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewMessage(event.target.innerText);
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      handleQuickButtonClicked={handleQuickButtonClicked}
      handleTextInputChange={handleTextInputChange}
      handleToggle={handleToggle}
      title='Form Maker'
      subtitle='Form Creation Support'
    />
  );
};
