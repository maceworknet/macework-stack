import path from 'path';
import type { Core } from '@strapi/strapi';

// Force Node.js to ignore self-signed certificate errors for the entire process
// This is necessary for some Strapi 5 + Managed DB configurations
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const client = 'postgres';

  let connectionUrl = env('DATABASE_URL');
  
  if (connectionUrl && !connectionUrl.includes('sslmode=')) {
    connectionUrl += connectionUrl.includes('?') ? '&sslmode=no-verify' : '?sslmode=no-verify';
  }

  return {
    connection: {
      client,
      connection: (connectionUrl ? {
        connectionString: connectionUrl,
        ssl: { rejectUnauthorized: false }
      } : {
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT', 25060),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: { rejectUnauthorized: false },
      }) as any,
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
      acquireConnectionTimeout: 60000,
    },
  };
};

export default config;