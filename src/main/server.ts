import 'dotenv/config';
import { http } from '@main/config/app';
import { prisma } from '@infra/database';

const PORT = process.env.PORT ?? '3333';

prisma
  .$connect()
  .then(() => {
    http.listen(PORT, () => {
      console.info(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
