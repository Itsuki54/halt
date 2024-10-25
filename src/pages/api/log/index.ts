import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import post from './post';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case 'POST':
        return await post(req, res);
      default:
        return res
          .status(405)
          .json({ status: 'error', error: 'Method Not Allowed' });
    }
  }
  catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: 'error', error: e.message });
    }

    return res
      .status(500)
      .json({ status: 'error', error: 'An unexpected error has occurred' });
  }
}
