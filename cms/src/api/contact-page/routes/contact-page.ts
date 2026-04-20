export default {
  routes: [
    {
      method: 'GET',
      path: '/contact-page',
      handler: 'contact-page.find',
      config: { auth: false, policies: [] },
    },
    {
      method: 'PUT',
      path: '/contact-page',
      handler: 'contact-page.update',
      config: { policies: [] },
    },
  ],
};

