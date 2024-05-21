import { useEffect, useState } from 'react';
import {
  addLinkSnippet,
  addResponseMessage,
  toggleMsgLoader,
  Widget,
} from 'react-chat-widget';

import { PATH } from '@/constants';
import { useElementLayouts } from '@/contexts';
import { useCreateFormMutation } from '@/redux/api/formApi';
import { useGetElementsFromQuestionMutation } from '@/redux/api/openAiApi';
import { ElementConfig, ElementType } from '@/types';
import { createElement } from '@/utils/elements';
import { separateFields } from '@/utils/seperates';

import 'react-chat-widget/lib/styles.css';

export const Chatbot = () => {
  const { elements } = useElementLayouts();

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

  const handleNewUserMessage = async (newMessage: string) => {
    toggleMsgLoader();
    // Now send the message throught the backend API
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
          try {
            createForm(filteredForm).then((res) => {
              if ('data' in res) {
                toggleMsgLoader();
                addLinkSnippet({
                  title: 'Your form link',
                  link: `http://localhost:5173${PATH.BUILD_FORM_PAGE}/${res.data!.data.id}`,
                  target: '_blank',
                });
              } else {
                toggleMsgLoader();
                addResponseMessage('Failed to create form. Please try again');
              }
            });
          } catch (error) {
            toggleMsgLoader();
            addResponseMessage('Failed to create form. Please try again');
          }
        } else {
          toggleMsgLoader();
          addResponseMessage(elementsResponse.data.message);
        }
      } else {
        toggleMsgLoader();
        addResponseMessage('Failed to create form. Please try again');
      }
    } catch (error) {
      toggleMsgLoader();
      addResponseMessage('Failed to create form. Please try again');
    }
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      handleToggle={handleToggle}
      title='Form Maker'
      subtitle='Form Creation Support'
    />
  );
};
