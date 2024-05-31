import { useRef, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button as MantineButton,
  CopyButton,
  Group,
  Stack,
  TextInput,
} from '@mantine/core';
import QRCode from 'qrcode.react';

import { Button } from '@/atoms/Button';
import { FRONT_END_URL } from '@/configs';
import { PATH } from '@/constants';
import { useBuildFormContext } from '@/contexts';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';

export const PublishSection = () => {
  const { id: formId } = useParams();
  const downloadRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { data: form } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );

  const { isEditForm } = useBuildFormContext();

  const link = isEditForm ? `${window.location.origin}/form/${form?.id}` : '';

  const handleDownloadClick = () => {
    if (downloadRef.current) {
      const canvas = document.createElement('canvas');
      const qrCodeCanvas = downloadRef.current.querySelector(
        'canvas',
      ) as HTMLCanvasElement;
      const qrCodeImg = qrCodeCanvas.toDataURL();
      const text = 'Scan me to submit answer';
      const bgColor = '#ffffff';

      canvas.width = qrCodeCanvas.width;
      canvas.height = qrCodeCanvas.height + 30;

      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const qrCodeImage = new Image();
      qrCodeImage.onload = () => {
        ctx.drawImage(qrCodeImage, 0, 0);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(text, 10, qrCodeCanvas.height + 20);
        const url = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = url;
        link.download = 'QRCode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      qrCodeImage.src = qrCodeImg;
    }
  };

  const handleCopyClick = () => {
    if (downloadRef.current) {
      const qrCodeCanvas = downloadRef.current.querySelector(
        'canvas',
      ) as HTMLCanvasElement;
      qrCodeCanvas.toBlob((blob) => {
        if (blob) {
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([clipboardItem]).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          });
        }
      });
    }
  };

  return (
    <Box className='relative flex h-mainHeight w-full items-center justify-center bg-navy-10'>
      <Stack className='absolute right-[48%] top-[50%] w-[660px] -translate-y-[50%] translate-x-[50%]'>
        <Group>
          <Box className='flex h-10 w-10 items-center justify-center rounded bg-navy-400'>
            <FaLink size={20} className='text-white' />
          </Box>
          <Stack className='gap-0'>
            <span className='text-base font-semibold text-blue-200'>
              DIRECT LINK OF YOUR FORM
            </span>
            <span className='text-sm text-blue-100'>
              Your form is securely published and ready to use at this address.
            </span>
          </Stack>
        </Group>
        <Stack className='mt-4 gap-8 rounded border border-solid border-blue-50 bg-white px-6 py-8'>
          <span className='text-base font-semibold text-blue-200'>
            SHARE WITH LINK
          </span>
          <TextInput
            leftSection={<FiLink size={16} />}
            value={link}
            variant='filled'
            readOnly
            classNames={{
              input: 'h-10 focus:border-none',
            }}
            onClick={(e) => e.currentTarget.select()}
          />
          <Group className='justify-end'>
            <CopyButton value={link}>
              {({ copied, copy }) => (
                <MantineButton
                  color='orange'
                  onClick={copy}
                  disabled={!isEditForm}
                >
                  {copied ? 'Copied to clipboard!' : 'COPY LINK'}
                </MantineButton>
              )}
            </CopyButton>
            <Button
              className='bg-blueButton hover:bg-blueButton'
              title='OPEN IN NEW TAB'
              onClick={() => {
                window.open(link, '_blank');
              }}
              disabled={!isEditForm}
            />
          </Group>
        </Stack>
        <Stack className='mt-4 gap-0 rounded border border-solid border-blue-50 bg-white px-6 py-8'>
          <span className='text-base font-semibold text-blue-200'>QR CODE</span>
          <div className='flex w-full items-center justify-between'>
            <Box className='mb-3 w-[240px]' ref={downloadRef}>
              <QRCode
                id='qrcode'
                value={`${FRONT_END_URL}${PATH.ANSWER_PAGE}/${formId}`}
                size={240}
                level={'H'}
                includeMargin={true}
              />
              <span className='pl-4'>Scan me to submit answer</span>
            </Box>
            <Group className='justify-end'>
              <MantineButton color='orange' onClick={handleCopyClick}>
                {copied ? 'Copied to clipboard!' : 'COPY QR CODE'}
              </MantineButton>
              <Button
                className='bg-blueButton hover:bg-blueButton'
                title='DOWNLOAD'
                onClick={handleDownloadClick}
              />
            </Group>
          </div>
        </Stack>
      </Stack>
    </Box>
  );
};
