'use client'
import { trpc } from '@/app/_trpc/client'
import { type serverClient } from '@/app/_trpc/serverClient'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export const TodoList = ({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)['getTodos']>>
}) => {
  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch()
    },
  })
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch()
    },
  })
  const deleteTodo = trpc.deleteTodo.useMutation({
    onSettled: () => {
      getTodos.refetch()
    },
  })

  const [content, setContent] = useState('')

  return (
    <div className="flex flex-col gap-10 py-5">
      <h1 className="text-center text-3xl font-bold">To Do</h1>
      <div className="flex flex-col gap-5">
        {getTodos.isLoading ? (
          'Loading...'
        ) : getTodos.data?.length ? (
          getTodos.data.map((todo) => (
            <Card
              key={todo.id}
              className="group flex flex-row items-center gap-5 px-5 py-3 hover:shadow"
            >
              <Checkbox
                checked={!!todo.done}
                onCheckedChange={async (checked) => {
                  setDone.mutate({ id: todo.id, done: checked == true })
                }}
              />
              <label className={cn('flex-grow', todo.done && 'line-through')}>
                {todo.content}
              </label>
              <Button
                className="invisible opacity-30 hover:opacity-70 group-hover:visible"
                variant="link"
                onClick={async () => {
                  deleteTodo.mutate({ id: todo.id })
                }}
              >
                Delete
              </Button>
            </Card>
          ))
        ) : (
          <span className="text-center opacity-70">Nothing to do</span>
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (content.length) {
            addTodo.mutate(content)
            setContent('')
          }
        }}
        className="flex flex-row items-center gap-5"
      >
        {/* <label htmlFor="content">Content</label> */}
        <Input
          id="content"
          value={content}
          placeholder="Add todo..."
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" className="whitespace-nowrap">
          Add todo
        </Button>
      </form>
    </div>
  )
}
