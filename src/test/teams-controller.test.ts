import request from 'supertest';

import { prisma } from '../database/prisma';
import { app } from '../app';

describe('TeamsController', () => {
  let user_id: string;
  let teams_id: string;
  let token: string;

  afterAll(async () => {
    await prisma.teams.delete({ where: { id: teams_id } });
    await prisma.users.delete({ where: { id: user_id } });
  });

  beforeAll(async () => {
    const response = await request(app).post('/users').send({
      name: 'Team Test User',
      email: 'teamtestuser@example.com',
      password: 'password123',
      role: 'admin',
    });

    user_id = response.body.id;

    const sessionsResponse = await request(app).post('/sessions').send({
      email: 'teamtestuser@example.com',
      password: 'password123',
    });

    token = sessionsResponse.body.token;
  });

  describe('POST/teams', () => {
    it('should create a new team successfully', async () => {
      const teamsResponse = await request(app)
        .post('/teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'team test',
          description: 'description test',
          userId: user_id,
        });

      teams_id = teamsResponse.body.id;

      expect(teamsResponse.status).toBe(201);
      expect(teamsResponse.body).toHaveProperty('id');
      expect(teamsResponse.body.name).toBe('team test');
    });
  });
});
