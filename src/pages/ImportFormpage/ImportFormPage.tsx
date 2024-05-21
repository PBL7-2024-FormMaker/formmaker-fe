import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Group, Stack, Text } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { gapi } from 'gapi-script';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/atoms/Button';
import { defaultSubmitConfig } from '@/configs';
import { API_KEY, CLIENT_ID } from '@/configs';
import { PATH } from '@/constants';
import { useBuildFormContext } from '@/contexts';
import {
  useCreateFormMutation,
  useGetFormDetailsQuery,
  useUpdateFormMutation,
} from '@/redux/api/formApi';
import {
  DatePickerElement,
  DropdownElement,
  ElementItem,
  ElementType,
  ErrorResponse,
  LongTextElement,
  MultipleChoiceElement,
  ScaleRatingElement,
  ShortTextElement,
  SingleChoiceElement,
  TimeInputElement,
} from '@/types';
import {
  datePickerGG,
  dropdownGG,
  getFormGG,
  longTextGG,
  multiplechoiceGG,
  questionGG,
  scaleRatingGG,
  shorttextGG,
  singleChoiceGG,
  timeGG,
  valueOption,
} from '@/types/ggForm';
import { toastify } from '@/utils';
import { getDefaultWidthHeight } from '@/utils/elements';
import { isValidGGFormURL } from '@/utils/schemas/validation';
import { separateFields } from '@/utils/seperates';

import { TextInput } from '../../components/molecules/TextInput';

const DISCOVERY_DOCS = [
  'https://forms.googleapis.com/$discovery/rest?version=v1',
];
const SCOPES = 'https://www.googleapis.com/auth/forms.body.readonly';

export interface GoogleFormResponse {
  result: getFormGG;
}
export const ImportFormPage = () => {
  const navigate = useNavigate();
  const { form } = useBuildFormContext();
  const [createForm] = useCreateFormMutation();
  const [formId, setFormId] = useState<string>('');
  const [updateForm] = useUpdateFormMutation();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [content, setContent] = useState<getFormGG>();
  const [formIdGG, setFormIdGG] = useState<string>('');
  const [elements, setElements] = useState<ElementItem[]>([]);
  const [disableButton, setdisableButton] = useState<boolean>(false);

  const handleCreateForm = () => {
    const filteredForm = separateFields(form);
    return createForm(filteredForm).then((res) => {
      if ('data' in res) {
        setFormId(res.data.data.id);
        return;
      }
      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const { data: formData } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(
          () => {
            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(authInstance.isSignedIn.get());
          },
          (error: GoogleFormResponse) => {
            setContent(error.result);
          },
        );
    };

    gapi.load('client:auth2', initClient);
  }, [formIdGG]);

  const handleCreateFormByFormURl = (formUrl: string) => {
    handleCreateForm();
    const parts = formUrl.split('/');
    if (
      parts.length > 5 &&
      parts[2] === 'docs.google.com' &&
      parts[3] === 'forms' &&
      parts[4] === 'd'
    ) {
      setFormIdGG(parts[5]);
    } else {
      setFormIdGG('');
    }
    if (!isSignedIn) {
      handleAuthClick();
    }
  };

  const updateSigninStatus = (isSignedIn: boolean) => {
    setIsSignedIn(isSignedIn);
    if (isSignedIn) {
      getForm();
    }
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const getForm = () => {
    gapi.client.forms.forms.get({ formId: formIdGG }).then(
      (response: GoogleFormResponse) => {
        setContent(response.result);
      },
      (error: GoogleFormResponse) => {
        setContent(error.result);
      },
    );
  };

  useEffect(() => {
    transferData(content!);
  }, [content]);

  const transferData = (formGGResponse: getFormGG) => {
    if (!formGGResponse) return;
    elements.push({
      id: uuidv4(),
      type: ElementType.HEADING,
      gridSize: {
        x: 0,
        y: 0,
        w: 12,
        h: 4,
      },
      config: {
        headingText: formGGResponse?.info?.title ?? 'Heading',
        subheadingText: formGGResponse?.info?.description ?? 'Subheader',
      },
      fields: [],
    });

    formGGResponse.items.map((item) => {
      const question = item.questionItem?.question;
      if (question) {
        if (isShorttextGG(question)) {
          (elements as ShortTextElement[]).push({
            id: uuidv4(),
            type: ElementType.SHORT_TEXT,
            config: {
              fieldLabel: item.title,
              required: question.required ?? false,
              placeholder: 'Type a sublabel',
              sublabel: 'Type a sublabel',
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.SHORT_TEXT),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'shortText',
              },
            ],
          });
        }
        if (isLongtextGG(question)) {
          (elements as LongTextElement[]).push({
            id: uuidv4(),
            type: ElementType.LONG_TEXT,
            config: {
              fieldLabel: item.title,
              required: question.required ?? false,
              placeholder: 'Type a sublabel',
              sublabel: 'Type a sublabel',
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.LONG_TEXT),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'longText',
              },
            ],
          });
        }
        if (singgleChoice(question)) {
          const options: string[] = [];
          const otherOption: { isDisplayed: boolean; text: string } = {
            isDisplayed: false,
            text: 'Other',
          };
          question.choiceQuestion.options.map((option) => {
            if ('value' in option) {
              options.push((option as valueOption).value);
            }
            if ('isOther' in option && option.isOther) {
              otherOption.isDisplayed = true;
              otherOption.text = 'Other';
            }
          });
          (elements as SingleChoiceElement[]).push({
            id: uuidv4(),
            type: ElementType.SINGLE_CHOICE,
            config: {
              fieldLabel: item.title,
              required: question.required ?? false,
              options: options,
              otherOption: otherOption,
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.SINGLE_CHOICE),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'singleChoice',
              },
            ],
          });
        }
        if (multipleChoice(question)) {
          const options: string[] = [];
          const otherOption: { isDisplayed: boolean; text: string } = {
            isDisplayed: false,
            text: 'Other',
          };
          question.choiceQuestion.options.map((option) => {
            if ('value' in option) {
              options.push((option as valueOption).value);
            }
            if ('isOther' in option && option.isOther) {
              otherOption.isDisplayed = true;
              otherOption.text = 'Other';
            }
          });
          (elements as MultipleChoiceElement[]).push({
            id: uuidv4(),
            type: ElementType.MULTIPLE_CHOICE,
            config: {
              fieldLabel: item.title,
              required: question.required ?? false,
              options: options,
              otherOption: otherOption,
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.MULTIPLE_CHOICE),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'multipleChoice',
              },
            ],
          });
        }
        if (dropDown(question)) {
          const options: string[] = [];
          const otherOption: { isDisplayed: boolean; text: string } = {
            isDisplayed: false,
            text: 'Other',
          };
          question.choiceQuestion.options.map((option) => {
            if ('value' in option) {
              options.push((option as valueOption).value);
            }
            if ('isOther' in option && option.isOther) {
              otherOption.isDisplayed = true;
              otherOption.text = 'Other';
            }
          });
          (elements as DropdownElement[]).push({
            id: uuidv4(),
            type: ElementType.DROPDOWN,
            config: {
              fieldLabel: item.title,
              sublabel: 'Type a sublabel',
              required: question.required ?? false,
              options: options,
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.DROPDOWN),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'dropdown',
              },
            ],
          });
        }
        if (datePicker(question)) {
          (elements as DatePickerElement[]).push({
            id: uuidv4(),
            type: ElementType.DATEPICKER,
            config: {
              fieldLabel: item.title,
              required: question.required ?? false,
              sublabel: 'Date',
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.DATEPICKER),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'datePicker',
              },
            ],
          });
        }
        if (time(question)) {
          (elements as TimeInputElement[]).push({
            id: uuidv4(),
            type: ElementType.TIME,
            config: {
              fieldLabel: item.title,
              required: question.required ?? false,
              sublabels: {
                hour: 'hour',
                minutes: 'minutes',
              },
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.TIME),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'timeInput',
              },
            ],
          });
        }
        if (scaleRating(question)) {
          (elements as ScaleRatingElement[]).push({
            id: uuidv4(),
            type: ElementType.SCALE_RATING,
            config: {
              fieldLabel: item.title,
              required: question.required ?? false,
              lowestRatingText: question.scaleQuestion.lowLabel ?? 'Worst',
              highestRatingText: question.scaleQuestion.highLabel ?? 'Best',
            },
            gridSize: {
              x: 0,
              y: elements.length * 5 + 4,
              ...getDefaultWidthHeight(ElementType.SCALE_RATING),
            },
            fields: [
              {
                id: uuidv4(),
                name: 'scaleRating',
              },
            ],
          });
        }
      }
      return;
    });

    elements.push({
      id: uuidv4(),
      type: ElementType.SUBMIT,
      gridSize: {
        x: 0,
        y: elements.length * 5 + 4,
        w: 12,
        h: 4,
      },
      config: defaultSubmitConfig,
      fields: [],
    });
    setElements(elements);
    if (!formData) return;
    return updateForm({
      id: formId,
      data: {
        title: formGGResponse.info.documentTitle,
        logoUrl: '',
        settings: {},
        createdAt: formData.createdAt!,
        updatedAt: '',
        elements: elements,
      },
    }).then((res) => {
      if ('data' in res) {
        setdisableButton(false);
        return navigate(`${PATH.BUILD_FORM_PAGE}/${res.data.data.id}`);
      }
      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const validateGGFormURL = async (value: string) =>
    isValidGGFormURL
      .validate(value)
      .then(() => {})
      .catch((err) => err.errors[0]);
  return (
    <Box className='relative flex h-[330px] w-full items-center justify-center'>
      <Stack className=' gap-2  rounded bg-white'>
        <Text>Enter URL Google form</Text>
        <Text className='text-sm text-slate-400'>
          Note: URL must be following this format:
          https://docs.google.com/forms/d/FORM_ID/edit
        </Text>
        <Formik
          initialValues={{ formUrl: '' }}
          validateOnBlur={true}
          validateOnChange={false}
          onSubmit={(value) => {
            setdisableButton(true);
            handleCreateFormByFormURl(value.formUrl);
          }}
        >
          <Form>
            <Field
              validate={validateGGFormURL}
              name='formUrl'
              placeholder='Type Google form URL to import'
              classNameWrapper='w-full'
              component={TextInput}
            />
            <Group className='justify-end'>
              <Button
                className='mt-2'
                type='submit'
                color='primary'
                title='Create form'
                disabled={disableButton}
              />
            </Group>
          </Form>
        </Formik>
      </Stack>
    </Box>
  );
};

export function isShorttextGG(obj: questionGG): obj is shorttextGG {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as shorttextGG).textQuestion === 'object' &&
    !('paragraph' in (obj as shorttextGG).textQuestion)
  );
}

export function isLongtextGG(obj: questionGG): obj is longTextGG {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as longTextGG).questionId === 'string' &&
    typeof (obj as longTextGG).textQuestion === 'object' &&
    'paragraph' in (obj as longTextGG).textQuestion
  );
}

export function singgleChoice(obj: questionGG): obj is singleChoiceGG {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj as singleChoiceGG).choiceQuestion?.type === 'RADIO'
  );
}
export function multipleChoice(obj: questionGG): obj is multiplechoiceGG {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj as multiplechoiceGG).choiceQuestion?.type === 'CHECKBOX'
  );
}
export function dropDown(obj: questionGG): obj is dropdownGG {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj as dropdownGG).choiceQuestion?.type === 'DROP_DOWN'
  );
}
export function datePicker(obj: questionGG): obj is datePickerGG {
  return typeof obj === 'object' && obj !== null && 'dateQuestion' in obj;
}
export function time(obj: questionGG): obj is timeGG {
  return typeof obj === 'object' && obj !== null && 'timeQuestion' in obj;
}
export function scaleRating(obj: questionGG): obj is scaleRatingGG {
  return typeof obj === 'object' && obj !== null && 'scaleQuestion' in obj;
}
