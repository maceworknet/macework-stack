export default {
  routes: [
    {
      method: 'GET',
      path: '/about-page',
      handler: 'about-page.find',
      config: { auth: false, policies: [] },
    },
    {
      method: 'PUT',
      path: '/about-page',
      handler: 'about-page.update',
      config: { policies: [] },
    },
  ],
};

