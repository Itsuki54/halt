import axios from 'axios';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Only POST requests are allowed' });
  }

  try {
    // テキストとキャラクターを取得
    const { text, speaker } = await req.json();

    // 音声合成用のクエリ作成
    const responseQuery = await axios.post(
      `${process.env.VOICEVOX_URL}/audio_query?speaker=${speaker}&text=${text}`,
    );

    // クエリを取得
    const query = responseQuery.data;

    // 音声を合成
    const responseSynthesis = await axios.post(
      `${process.env.VOICEVOX_URL}/synthesis?speaker=${speaker}`,
      query,
      {
        responseType: 'arraybuffer',
      },
    );

    // base64形式に変換
    const base64Data = Buffer.from(responseSynthesis.data, 'binary').toString('base64');

    return NextResponse.json({ response: base64Data });
  }
  catch (error) {
    console.log('error', error);
    return NextResponse.error();
  }
}
