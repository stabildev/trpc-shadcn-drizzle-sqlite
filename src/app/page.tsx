import { serverClient } from '@/app/_trpc/serverClient'

import { TodoList } from '@/components/TodoList'

export default async function Home() {
  const todos = await serverClient.getTodos()

  return (
    <main className="mx-auto mt-5 max-w-3xl">
      <TodoList initialTodos={todos} />
    </main>
  )
}
