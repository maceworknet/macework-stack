export default {
  routes: [
    {
      method: 'GET',
      path: '/home-page',
      handler: 'home-page.find',
      config: { auth: false, policies: [] },
    },
    {
      method: 'PUT',
      path: '/home-page',
      handler: 'home-page.update',
      config: { policies: [] },
    },
  ],
};
