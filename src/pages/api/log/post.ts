import { db } from '@/lib/prisma';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, botId, message, response } = req.body;

    if (!userId || !botId || !message || !response) {
      return res
        .status(400)
        .json({ status: 'error', error: 'User Data not provided' });
    }
    const bot = await db.log.create({
      data: {
        userId,
        botId,
        message,
        response,
      },
    });

    return res.status(200).json({ status: 'success', data: bot });
  }
  catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: 'error', error: e.message });
    }

    return res.status(500).json({ status: 'error', error: 'Unknown error occurred' });
  }
}
