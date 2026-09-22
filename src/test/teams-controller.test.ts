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

  describe('GET/teams', () => {
    it('should show the list of teams', async () => {
      const teamResponse = await request(app)
        .get('/teams')
        .set('Authorization', `Bearer ${token}`)
        .query({
          name: 'team',
        });

      expect(teamResponse.status).toBe(200);
      expect(teamResponse.body[0]).toHaveProperty('id');
      expect(teamResponse.body[0].name).toBe('team test');
    });

    it('should throw a error if team does not exist', async () => {
      const teamReponse = await request(app)
        .get('/teams')
        .set('Authorization', `Bearer ${token}`)
        .query({
          name: 'Non existent',
        });

      expect(teamReponse.status).toBe(400);
      expect(teamReponse.body.message).toBe('Team not found');
    });
  });

  describe('UPDATE/teams', () => {
    it('should update successfully', async () => {
      const teamResponse = await request(app)
        .patch(`/teams/${teams_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'update test ',
          description: 'update test',
        });

      expect(teamResponse.status).toBe(200);
      expect(teamResponse.body).toHaveProperty('id');
      expect(teamResponse.body.name).toBe('update test');
    });

    it('should throw a error if team does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const teamResponse = await request(app)
        .patch(`/teams/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'update test',
        });

      expect(teamResponse.status).toBe(400);
      expect(teamResponse.body.message).toBe('Team not found');
    });

    it('should dele team successfully', async () => {
      const createTeam = await request(app)
        .post('/teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'team test',
          description: 'description test',
          userId: user_id,
        });

      const createdTeamid = createTeam.body.id;
      const teamResponse = await request(app)
        .delete(`/teams/${createdTeamid}`)
        .set('Authorization', `Bearer ${token}`);

      expect(teamResponse.status).toBe(200);
    });
  });
});
