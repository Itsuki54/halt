import { db } from '@/lib/prisma';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, userId } = req.body;
    if (!type || !userId) {
      return res.status(400).json({ status: 'error', error: 'User Data not provided' });
    }

    const timestamp = new Date().toISOString();

    const bot = await db.bot.create({
      data: {
        type: type,
        userId: userId,
        group: {
          create: {
            name: `${type} Group ${timestamp}`,
            userId: userId, // Group の userId を設定
          },
        },
      },
      include: {
        group: true, // 返り値にGroupも含める
      },
    });

    return res.status(200).json({
      status: 'success',
      data: bot,
      groupId: bot.group ? bot.group.id : null,
    });
  }
  catch (e) {
    if (e instanceof Error) {
      console.log(e);
      return res.status(500).json({ status: 'error', error: e.message });
    }

    console.log(e);

    return res.status(500).json({ status: 'error', error: e });
  }
}
