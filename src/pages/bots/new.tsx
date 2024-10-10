import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/layout';

export default function NewBot() {
  const [gender, setGender] = useState<string>('');
  const router = useRouter();
  const { userId } = router.query;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gender, userId }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      toast.success('Bot created successfully');
      router.push('/');
    }
    else {
      toast.error('Failed to create bot');
    }
  };

  return (
    <Layout>
      <h1>New Bot</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
        </div>
        <button type='submit'>Create</button>
      </form>
    </Layout>
  );
}
