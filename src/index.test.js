const request = require('supertest');
const { app, server } = require('./index');

// Close server after all tests
afterAll((done) => {
  server.close(done);
});

describe('Portfolio API', () => {

  // ── Health check tests ──
  describe('GET /health', () => {
    test('returns 200 status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
    });

    test('returns status: ok', async () => {
      const res = await request(app).get('/health');
      expect(res.body.status).toBe('ok');
    });

    test('returns uptime as a number', async () => {
      const res = await request(app).get('/health');
      expect(typeof res.body.uptime).toBe('number');
    });
  });

  // ── Contact form tests ──
  describe('POST /api/contact', () => {
    test('returns 400 when fields are missing', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'Srujan' });
      expect(res.status).toBe(400);
    });

    test('returns error message when fields missing', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'Srujan', email: 'test@test.com' });
      expect(res.body.error).toBeDefined();
    });
  });

  // ── Static file tests ──
  describe('GET /', () => {
    test('serves the portfolio HTML page', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

});
