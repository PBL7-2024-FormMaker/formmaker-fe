import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';

import { PATH } from '@/constants/routes';
import {
  BuildFormContextProvider,
  ElementLayoutProvider,
  OverviewContextProvider,
} from '@/contexts';
import { BuildSection } from '@/organisms/BuildSection';
import { PreviewSection } from '@/organisms/PreviewSection';
import { PublishSection } from '@/organisms/PublishSection';
import { SettingsSection } from '@/organisms/SettingsSection';
import { AccountPage } from '@/pages/AccountPage';
import { BuildFormPage } from '@/pages/BuildFormPage';
import { LoadingPage } from '@/pages/LoadingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { PublicPage } from '@/pages/PublicPage';
import { SharingForm } from '@/pages/SharingForm';
import { SignupPage } from '@/pages/SignupPage';
import { TeamPage } from '@/pages/TeamPage';
import { getAccessTokenFromLS } from '@/utils';

import { EmailsSettingpage } from '../components/organisms/EmailsSettingpage';
import { FormsettingsPage } from '../components/organisms/FormsettingsPage';
import { ForgotPasswordPage } from '../pages/FogotPasswordPage';
import { ImportFormPage } from '../pages/ImportFormpage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';

const ResponsesPage = lazy(() => import('@/pages/ResponsesPage'));
// route required authentication to navigate
export function ProtectedRoute() {
  const isAuthenticated = Boolean(getAccessTokenFromLS());

  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN_PAGE} />;
}

// when not authenticated, it will navigate to this route
export function RejectedRoute() {
  const isAuthenticated = Boolean(getAccessTokenFromLS());

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={PATH.OVERVIEW_PAGE} replace={true} />
  );
}

export function useRouteElements() {
  const params = useLocation();

  const token = new URLSearchParams(params.search).get('token');
  const viewInvitation = new URLSearchParams(params.search).get(
    'view-invitation',
  );

  if (viewInvitation && token) {
    localStorage.setItem('acceptUrl', `${params.pathname}${params.search}`);
  }

  const routeElements = useRoutes([
    {
      path: PATH.ROOT_PAGE,
      element: <RejectedRoute />,
      children: [
        {
          path: PATH.ROOT_PAGE,
          element: <LoginPage />,
        },
        {
          path: PATH.LOGIN_PAGE,
          element: <LoginPage />,
        },
        {
          path: PATH.SIGNUP_PAGE,
          element: <SignupPage />,
        },
        {
          path: PATH.FORGOT_PASSWORD_PAGE,
          element: <ForgotPasswordPage />,
        },
        {
          path: PATH.RESET_PASSWORD_PAGE,
          element: <ResetPasswordPage />,
        },
      ],
    },
    {
      path: PATH.ROOT_PAGE,
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.OVERVIEW_PAGE,
          element: (
            <OverviewContextProvider>
              <OverviewPage />
            </OverviewContextProvider>
          ),
        },
        {
          path: PATH.ACCEPT_TO_FORM,
          element: <SharingForm />,
        },
        {
          path: PATH.BUILD_FORM_PAGE,
          element: (
            <BuildFormContextProvider>
              <ElementLayoutProvider>
                <BuildFormPage />
              </ElementLayoutProvider>
            </BuildFormContextProvider>
          ),
          children: [
            {
              path: '',
              element: <BuildSection />,
            },
            {
              path: 'import-form',
              element: <h1>Import form here</h1>,
            },
            {
              path: 'publish',
              element: <PublishSection />,
            },
            {
              path: 'settings',
              element: <SettingsSection />,
            },
            {
              path: 'preview',
              element: <PreviewSection />,
            },
            {
              path: 'publish/preview',
              element: <PreviewSection />,
            },
          ],
        },
        {
          path: PATH.EDIT_FORM_PAGE,
          element: (
            <BuildFormContextProvider>
              <ElementLayoutProvider>
                <BuildFormPage />
              </ElementLayoutProvider>
            </BuildFormContextProvider>
          ),
          children: [
            {
              path: '',
              element: <BuildSection />,
            },
            {
              path: 'import-form',
              element: <ImportFormPage />,
            },
            {
              path: 'publish',
              element: <PublishSection />,
            },
            {
              path: 'settings',
              element: <SettingsSection />,
              children: [
                {
                  path: 'general',
                  element: <FormsettingsPage />,
                },
                {
                  path: 'emails',
                  element: <EmailsSettingpage />,
                },
              ],
            },
            {
              path: 'preview',
              element: <PreviewSection />,
            },
            {
              path: 'publish/preview',
              element: <PreviewSection />,
            },
          ],
        },
        {
          path: PATH.MY_ACCOUNT_PAGE,
          element: <AccountPage />,
        },
        {
          path: PATH.RESPONSE_PAGE,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ResponsesPage />
            </Suspense>
          ),
        },
        {
          path: PATH.MY_TEAM,
          element: (
            <OverviewContextProvider>
              <TeamPage />
            </OverviewContextProvider>
          ),
        },
      ],
    },
    {
      path: PATH.PUBLIC_PAGE,
      element: (
        <ElementLayoutProvider>
          <PublicPage />
        </ElementLayoutProvider>
      ),
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
  return routeElements;
}
