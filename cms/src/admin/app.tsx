import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'tr',
    ],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
