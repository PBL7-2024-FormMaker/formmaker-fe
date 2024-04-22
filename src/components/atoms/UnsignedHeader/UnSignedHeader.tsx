import { Anchor, Image } from '@mantine/core';

import WhiteLogo from '@/assets/images/whitelogo.png';
import { PATH } from '@/constants/routes';

const HEIGHT_IMAGE = 50;

export const UnSignedHeader = () => (
  <header>
    <div className='flex items-center'>
      <Anchor href={PATH.ROOT_PAGE}>
        <Image src={WhiteLogo} h={HEIGHT_IMAGE} />
      </Anchor>
    </div>
  </header>
);
