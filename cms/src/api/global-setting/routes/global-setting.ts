export default {
  routes: [
    {
      method: 'GET',
      path: '/global-setting',
      handler: 'global-setting.find',
      config: { auth: false, policies: [] },
    },
    {
      method: 'PUT',
      path: '/global-setting',
      handler: 'global-setting.update',
      config: { policies: [] },
    },
  ],
};

