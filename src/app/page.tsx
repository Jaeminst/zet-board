import { Card, Title, Text } from '@tremor/react';
import Search from './search';
import UsersTable from './table';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const result = [{
    id: 0,
    name: 'hello',
    username: 'jmlee',
    email: 'jmlee@marketboro.com'
  }];
  const filteredResult = result.filter(item =>
    item.name.includes(search) || item.username.includes(search) || item.email.includes(search)
  );
  const users = filteredResult as User[];

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>A list of users retrieved from a Postgres database.</Text>
      <Search />
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card>
    </main>
  );
}
