import React, { useEffect } from 'react';

import LoginRequired from '@/components/auth/LoginRequired';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Layout from '@/pages/layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/prisma';
import {
    Bot,
    Log,
    Group as PrismaGroup,
    User,
} from '@prisma/client';

import { authOptions } from '../api/auth/[...nextauth]';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';

type FormInputs = {
    name: string;
    email: string;
    category: string;
    message: string;
};

interface Group extends PrismaGroup {
    logs: Log[];
}

interface Props {
    user: User | null;
    bot: Bot | null;
    currentGroup: Group | null;
    groups: Group[];
}

function ContactPage({ user, bot, currentGroup, groups }: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormInputs>();

    if (!user) {
        return <LoginRequired />;
    }


    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('お問い合わせ内容を送信しました');
                reset();
            } else {
                toast.error('お問い合わせの送信に失敗しました');
            }
        } catch (error) {
            toast.error('エラーが発生しました');
            console.error('Error submitting contact form:', error);
        }
    };

    return (
        <Layout>
            <Toaster position="top-right" /> {/* トースト表示用 */}
            <Container className="flex justify-center items-center h-screen">
                <div className="flex flex-col w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-6">
                    <Typography variant="h4" className="text-center font-bold" gutterBottom>
                        お問い合わせ
                    </Typography>
                    <Typography variant="body1" className="text-center text-gray-700" paragraph>
                        以下のフォームに必要事項をご入力の上、送信ボタンを押してください。
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        <TextField
                            label="お名前"
                            variant="outlined"
                            fullWidth
                            {...register('name', { required: 'お名前を入力してください' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <TextField
                            label="メールアドレス"
                            variant="outlined"
                            fullWidth
                            type="email"
                            {...register('email', {
                                required: 'メールアドレスを入力してください',
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: '有効なメールアドレスを入力してください',
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        {/* お問い合わせの種別のドロップダウン */}
                        <FormControl fullWidth variant="outlined" error={!!errors.category}>
                            <InputLabel id="category-label">お問い合わせの種別</InputLabel>
                            <Select
                                labelId="category-label"
                                label="お問い合わせの種別"
                                {...register('category', { required: 'お問い合わせの種別を選択してください' })}
                                defaultValue=""
                            >
                                <MenuItem value="general">一般的なお問い合わせ</MenuItem>
                                <MenuItem value="support">サポート</MenuItem>
                                <MenuItem value="feedback">フィードバック</MenuItem>
                                <MenuItem value="other">その他</MenuItem>
                            </Select>
                            {errors.category && <Typography color="error">{errors.category.message}</Typography>}
                        </FormControl>

                        <TextField
                            label="メッセージ"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            {...register('message', { required: 'メッセージを入力してください' })}
                            error={!!errors.message}
                            helperText={errors.message?.message}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                        >
                            送信
                        </Button>
                    </form>
                </div>
            </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    const userData = await db.user.findUnique({ where: { id: session.user.uid } });
    if (!userData) {
        return { props: { user: null, bot: null, currentGroup: null, groups: [] } };
    }

    return {
        props: {
            user: JSON.parse(JSON.stringify(userData)),
        },
    };
};


export default ContactPage;

