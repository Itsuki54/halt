import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import get from './get';
import patch from './patch';
import post from './post';
import remove from './remove';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case 'POST':
        return await post(req, res);
      case 'GET':
        return await get(req, res);
      case 'PATCH':
        return await patch(req, res);
      case 'DELETE':
        return await remove(req, res);
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
    else {
      return res
        .status(500)
        .json({ status: 'error', error: 'An unexpected error has occurred' });
    }
  }
}
