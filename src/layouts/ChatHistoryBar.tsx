import { Group } from '@prisma/client';
import { useRouter } from 'next/router';

interface Props {
  groups: Group[]; // 複数のGroupを受け取る
}

export function ChatHistoryBar({ groups }: Props) {
  const router = useRouter();

  return (
    <div className="h-full w-full text-white bg-gray-800 p-4">
      <h2 className="text-lg font-bold mb-4">Chat Groups</h2>
      <ul className="space-y-4 list-disc list-inside">
        {groups.map((group) => (
          <li
            key={group.id}
            className="cursor-pointer p-2 rounded-md bg-gray-700 hover:bg-gray-600"
            onClick={() => router.push(`/groups/${group.id}`)} // Groupページに遷移
          >
            <div className="text-sm font-medium">{group.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
