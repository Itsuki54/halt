import { db } from '@/lib/prisma';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id: uid } = req.query;
    if (!uid) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Bot ID not provided' });
    }
    const bot = await db.bot.findUnique({
      where: {
        id: uid.toString(),
      },
    });
    if (!bot) {
      return res.status(404).json({ status: 'error', error: 'Bot not found' });
    }
    return res.status(200).json({ status: 'success', data: bot });
  }
  catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: 'error', error: e.message });
    }

    return res.status(500).json({ status: 'error', error: e });
  }
}
