import { Refine } from '@refinedev/core';
import {
  ThemedLayoutV2,
  notificationProvider,
  ErrorComponent,
  RefineThemes,
} from '@refinedev/antd';
import routerBindings, {
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import '@refinedev/antd/dist/reset.css';

// data-provider
import { dataProvider } from './data-provider';
// import dataProvider from '@refinedev/simple-rest';
// import { dataProvider } from './rest-data-provider';

// view
import { BlogPostList } from './pages/blog_posts/list';
import { BlogPostEdit } from './pages/blog_posts/Edit';
import { BlogPostShow } from './pages/blog_posts/show';
import { BlogPostCreate } from './pages/blog_posts/create';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <Refine
          routerProvider={routerBindings}
          dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
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
                <ThemedLayoutV2>
                  <Outlet />
                </ThemedLayoutV2>
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
