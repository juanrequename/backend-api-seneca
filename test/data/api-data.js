const supertest = require('supertest');

export const request = supertest('http://localhost:3000');
const prefix = '/v1/';
export const jsonContentTypeExpected = ['Content-Type', 'application/json; charset=utf-8'];

export function api(path) {
  return prefix + path;
}

export const credentials = {
  'x-auth-token': '',
};
