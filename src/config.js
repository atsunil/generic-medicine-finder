import dotenv from 'dotenv';
dotenv.config();

let runtimeApiKey = process.env.SERPAPI_API_KEY || '';

export const config = {
  port: process.env.PORT || 3000,
  get serpApiKey() {
    return runtimeApiKey;
  },
  setSerpApiKey(key) {
    runtimeApiKey = (key || '').trim();
  },
  hasSerpApiKey() {
    return Boolean(runtimeApiKey && runtimeApiKey.length > 5);
  }
};
