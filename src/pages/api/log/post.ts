import { db } from '@/lib/prisma';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { message, response, groupId } = req.body;

    if (!message || !response) {
      return res
        .status(400)
        .json({ status: 'error', error: 'User Data not provided' });
    }

    console.log(groupId);

    const bot = await db.log.create({
      data: {
        message: message,
        response: response,
        groupId: groupId,
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
