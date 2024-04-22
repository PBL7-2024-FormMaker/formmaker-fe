import { ToastContainer, Zoom } from 'react-toastify';

import { TOAST_DURATION } from '@/constants/toast';

import 'react-toastify/dist/ReactToastify.css';

export const Toast = () => (
  <ToastContainer
    position='top-right'
    autoClose={TOAST_DURATION.DEFAULT}
    newestOnTop
    pauseOnHover
    pauseOnFocusLoss
    closeOnClick={false}
    rtl={false}
    draggable={false}
    transition={Zoom}
  />
);
