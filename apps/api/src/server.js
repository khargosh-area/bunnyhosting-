import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

const app = Fastify({ logger: true });
const port = Number(process.env.API_PORT ?? 4000);
const host = process.env.API_HOST ?? '127.0.0.1';
const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:3000';

// Read-only demo data. Real provisioning will be added behind the secured node agent.
const demoServers = [{
  id: 'demo-survival',
  name: 'Survival SMP',
  edition: 'Java',
  software: 'Paper',
  status: 'offline',
  address: 'Not assigned'
}];

await app.register(cors, { origin: webOrigin, methods: ['GET'] });

app.get('/health', async () => ({
  ok: true,
  name: 'Bunny Hosting API',
  version: '0.1.0'
}));

app.get('/api/servers', async () => ({ data: demoServers }));

app.setNotFoundHandler((request, reply) => {
  reply.code(404).send({ error: 'Not found' });
});

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
