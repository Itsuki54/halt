import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, Typography, TextField, Button } from '@mui/material';
import Layout from '@/pages/layout';

type FormInputs = {
    name: string;
    email: string;
    message: string;
};

const ContactPage: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        console.log("お問い合わせ内容:", data);
        reset(); // 送信後にフォームをリセット
    };

    return (
        <Layout>
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

export default ContactPage;
