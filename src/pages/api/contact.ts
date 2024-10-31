import { db } from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, category, content } = req.body;

    try {
      const contact = await db.contact.create({
        data: {
          name,
          email,
          category,
          message: content,
        },
      });
      res.status(200).json(contact);
    }
    catch (error) {
      res.status(500).json({ error: 'データベースへの保存に失敗しました。' });
    }
  }
  else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
