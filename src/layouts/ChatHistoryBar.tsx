import { Group } from '@prisma/client';
import { useRouter } from 'next/router';

interface Props {
  groups: Group[]; // 複数のGroupを受け取る
  onClickedNewBot: () => void;
}

export function ChatHistoryBar({ groups, onClickedNewBot }: Props) {
  const router = useRouter();

  return (
    <div className='flex flex-col h-full w-full text-white bg-gray-800 p-4'>
      <h2 className='text-lg font-bold mb-4'>Chat Groups</h2>
      <ul className='flex-grow overflow-y-auto space-y-2 list-disc list-inside'>
        {groups.map(group => (
          <li
            key={group.id}
            className='cursor-pointer p-2 rounded-md bg-gray-700 hover:bg-gray-600'
            onClick={() => router.push(`/?groupId=${group.id}`)} // Groupページに遷移
          >
            <div className='text-sm font-medium'>{group.name}</div>
          </li>
        ))}
      </ul>
      {/* ボタンを下部に固定 */}
      <button
        onClick={onClickedNewBot}
        className='mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-medium text-center transition-colors duration-200'
      >
        ＋新しい悩みを相談する
      </button>
    </div>
  );
}
