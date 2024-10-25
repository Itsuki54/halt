import {
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

export default function Document() {
  return (
    <Html lang='ja'>
      <Head>
        <meta content='Connect2uは、人間らしいAIによる24時間対応の感情的サポートや悩み相談を提供するサービスです。' name='description' />
        <meta content='AI 相談, 感情サポート, AI アドバイス, 24時間 AI サポート, メンタルヘルス AI, Connect2u' name='keywords' />
        <meta content='Connect2u' name='author' />

        <meta content='Connect2u - 感情サポートと相談を行うAIサービス' property='og:title' />
        <meta content='Connect2uは、人間のように感情を理解し、24時間対応の感情サポートと相談を提供するAIサービスです。' property='og:description' />
        <meta content='https://example.com/og-image.jpg' property='og:image' />
        <meta content='https://prototype-connect2u.vercel.app' property='og:url' />
        <meta content='website' property='og:type' />

        <meta content='summary_large_image' name='twitter:card' />
        <meta content='Connect2u - AIによる相談と感情サポート' name='twitter:title' />
        <meta content='Connect2uのAIは、人間らしい感情サポートとアドバイスを24時間提供し、あなたのメンタルヘルスをサポートします。' name='twitter:description' />
        <meta content='https://example.com/twitter-image.jpg' name='twitter:image' />

        <link href='https://prototype-connect2u.vercel.app' rel='canonical' />

        <script type='application/ld+json'>
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Connect2u - 感情サポートと相談を行うAIサービス",
            "description": "Connect2uは、感情的サポートと悩み相談を行う人間らしいAIシステムです。いつでもどこでも相談できる安心のサービス。",
            "url": "https://prototype-connect2u.vercel.app",
          }
          `}
        </script>
        <title>Connect2u - 感情サポートと相談を行うAIサービス</title>
      </Head>
      <body className='antialiased'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
