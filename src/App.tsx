import { Authenticated, Refine } from '@refinedev/core';
import {
  ThemedLayoutV2,
  notificationProvider,
  ErrorComponent,
  RefineThemes,
} from '@refinedev/antd';
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import axios from 'axios';
import '@refinedev/antd/dist/reset.css';

// data-provider
import { dataProvider } from './providers/data-provider';

// view
import { BlogPostList } from './pages/blog_posts/list';
import { BlogPostEdit } from './pages/blog_posts/edit';
import { BlogPostShow } from './pages/blog_posts/show';
import { BlogPostCreate } from './pages/blog_posts/create';

// auth
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { authProvider } from './providers/authProvider';
import { AuthPage } from './pages/auth';

const API_URL = 'https://api.fake-rest.refine.dev';
const axiosInstance = axios.create();

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest: {
  response: { config: { headers: { [x: string]: string } } };
}) =>
  axiosInstance
    .post(`${API_URL}/auth/token/refresh`)
    .then((tokenRefreshResponse) => {
      localStorage.setItem('token', tokenRefreshResponse.data.token);

      failedRequest.response.config.headers['Authorization'] =
        'Bearer ' + tokenRefreshResponse.data.token;

      return Promise.resolve();
    });

// Instantiate the interceptor
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

axiosInstance.interceptors.request.use((config) => {
  // Retrieve the token from local storage
  const token = JSON.parse(localStorage.getItem('auth') || '');
  // Check if the header property exists
  if (config.headers) {
    // Set the Authorization header if it exists
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <Refine
          authProvider={authProvider}
          routerProvider={routerBindings}
          dataProvider={dataProvider(API_URL)}
          notificationProvider={notificationProvider}
          resources={[
            {
              name: 'blog_posts',
              list: '/blog-posts',
              show: '/blog-posts/show/:id',
              create: '/blog-posts/create',
              edit: '/blog-posts/edit/:id',
              meta: { canDelete: true },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route
              element={
                <Authenticated
                  key={1}
                  fallback={<CatchAllNavigate to='/login' />}
                >
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route
                index
                element={<NavigateToResource resource='blog_posts' />}
              />
              <Route path='blog-posts'>
                <Route index element={<BlogPostList />} />
                <Route path='show/:id' element={<BlogPostShow />} />
                <Route path='edit/:id' element={<BlogPostEdit />} />
                <Route path='create' element={<BlogPostCreate />} />
              </Route>
            </Route>
            <Route
              element={
                <Authenticated key={2} fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route path='/login' element={<AuthPage type='login' />} />
              <Route path='/register' element={<AuthPage type='register' />} />
              <Route
                path='/forgot-password'
                element={<AuthPage type='forgotPassword' />}
              />
              <Route
                path='/update-password'
                element={<AuthPage type='updatePassword' />}
              />
            </Route>
            <Route
              element={
                <Authenticated key={3} fallback={<Outlet />}>
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route path='*' element={<ErrorComponent />} />
            </Route>
          </Routes>
          <UnsavedChangesNotifier />
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
