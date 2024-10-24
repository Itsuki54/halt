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
        <meta name='description' content='Connect2uは、人間らしいAIによる24時間対応の感情的サポートや悩み相談を提供するサービスです。' />
        <meta name='keywords' content='AI 相談, 感情サポート, AI アドバイス, 24時間 AI サポート, メンタルヘルス AI, Connect2u' />
        <meta name='author' content='Connect2u' />

        <meta property='og:title' content='Connect2u - 感情サポートと相談を行うAIサービス' />
        <meta property='og:description' content='Connect2uは、人間のように感情を理解し、24時間対応の感情サポートと相談を提供するAIサービスです。' />
        <meta property='og:image' content='https://example.com/og-image.jpg' />
        <meta property='og:url' content='https://prototype-connect2u.vercel.app' />
        <meta property='og:type' content='website' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Connect2u - AIによる相談と感情サポート' />
        <meta name='twitter:description' content='Connect2uのAIは、人間らしい感情サポートとアドバイスを24時間提供し、あなたのメンタルヘルスをサポートします。' />
        <meta name='twitter:image' content='https://example.com/twitter-image.jpg' />

        <link rel='canonical' href='https://prototype-connect2u.vercel.app' />

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
