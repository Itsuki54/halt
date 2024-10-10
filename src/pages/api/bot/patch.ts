import { db } from '@/lib/prisma';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function patch(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  try {
    const { id: botId, gender, purpose, character, imageUrl, userId } = req.body;

    if (!botId) {
      return res.status(400).json({ status: 'error', error: 'Bot ID not provided' });
    }

    if (!gender || !purpose || !character || !imageUrl || !userId) {
      return res.status(400).json({ status: 'error', error: 'Missing required fields' });
    }

    const bot = await db.bot.update({
      where: {
        id: botId,
      },
      data: {
        gender,
        purpose,
        character,
        imageUrl,
        userId,
      },
    });

    return res.status(200).json({ status: 'success', data: bot });
  }
  catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: 'error', error: e.message });
    }
    else {
      return res.status(500).json({ status: 'error', error: 'Unknown error occurred' });
    }
  }
}
