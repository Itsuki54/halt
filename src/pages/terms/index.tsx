import React from 'react';
import { Container, Typography, Link, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const TermsPage: React.FC = () => {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const response = await signIn('google', { redirect: false });
            if (!response || response.error) {
                toast.error('Googleログインに失敗しました');
            }
            else {
                toast.success('Googleでログインしました！');
                router.push('/');
            }
        }
        catch {
            toast.error('Googleログインに失敗しました');
        }
    };


    const handleDisagree = () => {
        router.push('/');
    };

    return (
        <div className='flex flex-col items-center h-screen bg-gray-100 p-6'>
            <div>
                <Typography variant="h3" gutterBottom>
                    利用規約
                </Typography>
                <Typography variant="body1" paragraph>
                    - アプリケーションはOpenAI社のChatGPT-APIを利用したサービスです。
                </Typography>
                <Typography variant="body1" paragraph>
                    - 本アプリケーション内で行われた会話のログは、利用者様の情報と併せて、今後の参考とするために保管させて頂いております。予めご了承下さい。
                </Typography>
                <Typography variant="body1" paragraph>
                    - AIは必ずしも倫理的に正しい言動を行うとは限りません。本サービスでの会話を受けて行動した場合の結果に対して、サービス提供者は責任を負いかねます。
                </Typography>
                <Typography variant="body1" paragraph>
                    詳しくは、以下のリンク先でChatGPTの利用規約をご確認ください。
                </Typography>
                <Link href="https://openai.com/ja-JP/policies/terms-of-use/" target="_blank" rel="noopener noreferrer">
                    ChatGPT 利用規約
                </Link>

                <div className="mt-4 flex space-x-4">
                    <Button variant="contained" color="primary" onClick={handleGoogleSignIn}>
                        同意する
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleDisagree}>
                        同意しない
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
