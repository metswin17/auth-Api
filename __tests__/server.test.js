'use strict';

process.env.DATABASE_URL = 'sqlite::memory:';

const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const supertest = require('supertest');
const { server } = require('../src/server.js');
const { db, users } = require('../src/models');

const request = supertest(server);

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll(async () => {
  await db.close();
});

describe('API Server', () => {

  test('GET /api/v1/food returns 200', async () => {
    const response = await request.get('/api/v1/food');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('GET /api/v2/food without a token returns 401', async () => {
    const response = await request.get('/api/v2/food');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid Login');
  });

  test('POST /signup creates a user and returns 201', async () => {
    const response = await request
      .post('/signup')
      .send({
        username: 'testuser',
        password: 'testpass123'
      });
  
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe('testuser');
    expect(response.body.user.role).toBe('user');
    expect(response.body.token).toBeDefined();
    expect(response.body.user.password).toBeUndefined();
  });
  
  test('POST /signin accepts valid Basic Authentication', async () => {
    const response = await request
      .post('/signin')
      .auth('testuser', 'testpass123');
  
    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe('testuser');
    expect(response.body.token).toBeDefined();
  });
  
  test('GET /api/v2/food accepts a valid JWT', async () => {
    const signin = await request
      .post('/signin')
      .auth('testuser', 'testpass123');
  
    const response = await request
      .get('/api/v2/food')
      .set('Authorization', `Bearer ${signin.body.token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/v2/food denies a user without create permission', async () => {
    const signin = await request
      .post('/signin')
      .auth('testuser', 'testpass123');
  
    const response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${signin.body.token}`)
      .send({
        name: 'Apple',
        calories: 95,
        type: 'fruit'
      });
  
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access Denied');
  });

  test('POST /api/v2/food allows a writer to create a record', async () => {
    await users.create({
      username: 'testwriter',
      password: 'writerpass123',
      role: 'writer'
    });

    const signin = await request
      .post('/signin')
      .auth('testwriter', 'writerpass123');

    expect(signin.status).toBe(200);

    const response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${signin.body.token}`)
      .send({
        name: 'Apple',
        calories: 95,
        type: 'fruit'
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Apple');
  });

  test('GET /api/v2/food/:id retrieves a saved record', async () => {
    const signin = await request
      .post('/signin')
      .auth('testwriter', 'writerpass123');

    expect(signin.status).toBe(200);

    const response = await request
      .get('/api/v2/food/1')
      .set('Authorization', `Bearer ${signin.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Apple');
  });

  test('PUT /api/v2/food/:id allows an editor to update a record', async () => {
    await users.create({
      username: 'testeditor',
      password: 'editorpass123',
      role: 'editor'
    });

    const signin = await request
      .post('/signin')
      .auth('testeditor', 'editorpass123');

    expect(signin.status).toBe(200);

    const response = await request
      .put('/api/v2/food/1')
      .set('Authorization', `Bearer ${signin.body.token}`)
      .send({
        name: 'Green Apple',
        calories: 95,
        type: 'fruit'
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Green Apple');
  });

  test('DELETE /api/v2/food/:id allows an admin to delete a record', async () => {
    await users.create({
      username: 'testadmin',
      password: 'adminpass123',
      role: 'admin'
    });

    const signin = await request
      .post('/signin')
      .auth('testadmin', 'adminpass123');

    expect(signin.status).toBe(200);

    const response = await request
      .delete('/api/v2/food/1')
      .set('Authorization', `Bearer ${signin.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBe(1);

    const check = await request
      .get('/api/v2/food/1')
      .set('Authorization', `Bearer ${signin.body.token}`);

    expect(check.status).toBe(200);
    expect(check.body).toBeNull();
  });

});