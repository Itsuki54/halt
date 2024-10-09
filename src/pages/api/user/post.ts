import { db } from '@/lib/prisma';
import argon2 from 'argon2';
import crypto from 'crypto';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

const genSalt = () => {
  const S = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(crypto.randomFillSync(new Uint32Array(24)))
    .map(v => S[v % S.length])
    .join('');
};

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password, type } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 'error', error: 'User Data not provided' });
    }
    const pepper = process.env.PEPPER;
    const salt = genSalt();
    const hash = await argon2.hash(pepper + password + salt);
    const user = await db.user.create({
      data: {
        name: 'New User',
        email,
        password: hash,
        salt,
      },
    });
    return res.status(200).json({ status: 'success', data: user });
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
