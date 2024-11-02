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
        <meta content='HAltは、人間らしいAIによる24時間対応の感情的サポートや悩み相談を提供するサービスです。' name='description' />
        <meta content='AI 相談, 感情サポート, AI アドバイス, 24時間 AI サポート, メンタルヘルス AI, HAlt' name='keywords' />
        <meta content='HAlt' name='author' />

        <meta content='HAlt - 感情サポートと相談を行うAIサービス' property='og:title' />
        <meta content='HAltは、人間のように感情を理解し、24時間対応の感情サポートと相談を提供するAIサービスです。' property='og:description' />
        <meta content='https://example.com/og-image.jpg' property='og:image' />
        <meta content='https://halt.otomos.jp' property='og:url' />
        <meta content='website' property='og:type' />

        <meta content='summary_large_image' name='twitter:card' />
        <meta content='HAlt - AIによる相談と感情サポート' name='twitter:title' />
        <meta content='HAltのAIは、人間らしい感情サポートとアドバイスを24時間提供し、あなたのメンタルヘルスをサポートします。' name='twitter:description' />
        <meta content='https://example.com/twitter-image.jpg' name='twitter:image' />

        <link href='https://halt.otomos.jp' rel='canonical' />

        <script type='application/ld+json'>
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "HAlt - 感情サポートと相談を行うAIサービス",
            "description": "HAltは、感情的サポートと悩み相談を行う人間らしいAIシステムです。いつでもどこでも相談できる安心のサービス。",
            "url": "https://halt.otomos.jp",
          }
          `}
        </script>
      </Head>
      <body className='antialiased'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
