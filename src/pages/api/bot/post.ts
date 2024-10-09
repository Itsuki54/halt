import { db } from '@/lib/prisma';
import argon2 from 'argon2';
import crypto from 'crypto';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  console.log(
    'req.body',
    req.body,
  );
  try {
    const { gender, userId } = req.body;
    if (!gender || !userId) {
      return res
        .status(400)
        .json({ status: 'error', error: 'User Data not provided' });
    }
    const bot = await db.bot.create({
      data: {
        gender,
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
      return res.status(500).json({ status: 'error', error: e });
    }
  }
}
