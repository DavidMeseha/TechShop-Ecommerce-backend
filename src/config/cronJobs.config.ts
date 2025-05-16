import cron from 'node-cron';
import Users from '../models/Users';

export default function configureCronJobs() {
  // Remove users without passwords daily
  cron.schedule('0 0 * * *', async () => {
    const deleted = await Users.deleteMany({ password: null });
    console.warn('Expired records deleted:', deleted);
  });
}
