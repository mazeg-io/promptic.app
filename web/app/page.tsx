"use client";
import React from "react";
import { db } from "../instant";
import { id } from "@instantdb/react";

function Home() {
  const { isLoading, error, data } = db.useQuery({ todos: {} });

  const createTodo = () => {
    console.log("createTodo");
    db.transact(
      db.tx.todos[id()].update({
        text: "eat",
        done: false,
        createdAt: Date.now(),
      })
    );
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && data.todos.map((todo) => <div key={todo.id}>{todo.text}</div>)}
      <button
        className=" cursor-pointer bg-blue-500 text-white p-2 rounded-md"
        onClick={createTodo}
      >
        Create Todo
      </button>
    </div>
  );
}

export default Home;
