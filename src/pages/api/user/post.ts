import { db } from '@/lib/prisma';

import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: 'error', error: 'User Data not provided' });
    }
    const user = await db.user.create({
      data: {
        email,
      },
    });
    return res.status(200).json({ status: 'success', data: user });
  }
  catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: 'error', error: e.message });
    }
    
      return res.status(500).json({ status: 'error', error: e });
    
  }
}
