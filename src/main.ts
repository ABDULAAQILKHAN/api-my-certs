import { AppFactory } from './AppFactory';

async function bootstrap() {
  const { app } = await AppFactory.create();
  await app.listen(4000);
  console.log(`🚀 Running at http://localhost:${4000}`);
}
const vercel = false
// Run bootstrap only if not on Vercel
if (!vercel) {
  console.log('Not on Vercel, starting server...'); 
  bootstrap();
}

// Export handler for Vercel
export default async function handler(req, res) {
  const { app, expressApp } = await AppFactory.create();
  await app.init();
  return expressApp(req, res);
}
