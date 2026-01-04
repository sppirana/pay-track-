import { buildApp, connectDB } from '../src/app';

const app = buildApp();

export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
