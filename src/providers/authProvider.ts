import { AuthBindings } from '@refinedev/core';

const mockUsers = [{ email: 'apip@mail.com' }, { email: 'rania@mail.com' }];

export const authProvider: AuthBindings = {
  login: async ({ email }) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers.find((item) => item.email === email);

    if (user) {
      localStorage.setItem('auth', JSON.stringify(user));

      return {
        success: true,
        redirectTo: '/',
      };
    }

    return {
      success: false,
      error: {
        message: 'Login Error',
        name: 'Invalid email or password',
      },
    };
  },

  check: async () => {
    const user = localStorage.getItem('auth');

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: '/login',
      error: {
        message: 'Check failed',
        name: 'Unauthorized',
      },
    };
  },

  logout: async () => {
    localStorage.removeItem('auth');
    return {
      success: true,
      redirectTo: '/login',
    };
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: '/login',
        error,
      };
    }

    return {};
  },

  getPermissions: () => {
    const user = localStorage.getItem('auth');

    if (user) {
      const { roles } = JSON.parse(user);

      return roles;
    }

    return null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem('auth');

    if (user) {
      const { email, roles } = JSON.parse(user);

      return {
        email,
        roles,
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/300',
      };
    }

    return null;
  },

  register: async ({ email }) => {
    const user = mockUsers.find((user) => user.email === email);

    if (user) {
      return {
        success: false,
        error: {
          name: 'Register Error',
          message: 'User already exists',
        },
      };
    }

    mockUsers.push({ email });

    return {
      success: true,
      redirectTo: '/login',
    };
  },

  forgotPassword: async () => {
    // send password reset link to the user's email address here

    // if request is successful
    return {
      success: true,
      redirectTo: '/login',
    };

    // if request is not successful
    return {
      success: false,
      error: {
        name: 'Forgot Password Error',
        message: 'Email address does not exist',
      },
    };
  },

  updatePassword: async () => {
    // update the user's password here

    // if request is successful
    return {
      success: true,
      redirectTo: '/login',
    };

    // if request is not successful
    return {
      success: false,
      error: {
        name: 'Forgot Password Error',
        message: 'Email address does not exist',
      },
    };
  },
};
