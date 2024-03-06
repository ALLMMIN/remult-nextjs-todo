import React, { FormEvent, useEffect, useState } from "react";

import { remult } from "remult";
// import { title } from "process";

import { signIn, signOut, useSession } from "next-auth/react";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";

const taskRepo = remult.repo(Task);

function fetchTasks() {
  return taskRepo.find({
    // limit: 2, (กำหนดให้แสดงแค่ / รายการ )
    orderBy: {
      completed: "asc",
    },
    where: {
      completed: undefined,
    },
  });
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed);
    fetchTasks().then(setTasks);
  };

  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") signIn();
    else fetchTasks().then(setTasks);
  }, [session]);
  return (
    <div className="bg-gray-50 h-screen flex items-center flex-col justify-center test-lg">
      <h1 className="text-red-500 text-6xl  ">งานที่ต้องทำ</h1>
      <p className="text-center text-2xl">จำนวน Post : {tasks.length}</p>
      <main className="bg-white border rounded-lg shadow-lg  m-5 w-screen max-w-5xl px-4  ">
        <div className="flex gap-2 px-2 p-2 border-b">
          <div className="flex-none w-18 pt-2 text-lg ">สวัสดีคุณ</div>
          <div className="flex-1  ">
            <p className="text-red-500 pt-2 text-lg">
              {session.data?.user?.name}
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="grid justify-items-end bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 border border-gray-400 rounded shadow "
          >
            logout
          </button>
        </div>
        <form
          onSubmit={addTask}
          className="flex gap-2 border-b-2 px-2 p-6 text-lg"
        >
          <input
            className="w-full  text-lg"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="กรุณาเพิ่มรายการ"
          />
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </form>

        <div className="flex gap-1 pl-2 pr-3  border-b text-green-600">
          <div className="flex-none text-lg">สถานะ</div>
          <div className="flex-1  "></div>
          <div className="grid justify-items-end text-lg">แก้ไข</div>
          <p>/</p>
          <div className="grid justify-items-end text-lg">ลบ</div>
        </div>

        {tasks.map((task) => {
          const setTask = (value: Task) =>
            setTasks(tasks.map((t) => (t === task ? value : t)));

          const setCompleted = async (completed?: boolean) =>
            setTask(await taskRepo.save({ ...task, completed }));

          const setTitle = (title: string) => setTask({ ...task, title });

          const saveTask = async () => {
            try {
              setTask(await taskRepo.save(task));
            } catch (err: any) {
              alert(err.message);
            }
          };

          const deleteTask = async () => {
            try {
              await taskRepo.delete(task);
              setTasks(tasks.filter((t) => t !== task));
            } catch (err: any) {
              alert(err.message);
            }
          };

          return (
            <div
              key={task.id}
              className="border-b px-full gap-2 flex items-center p-4 text-lg"
            >
              <input
                type="checkbox"
                checked={task.completed}
                className="w-6 h-6"
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <input
                value={task.title}
                className="w-full"
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={saveTask}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
              <button onClick={deleteTask}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          );
        })}
        <div className="border-t px-6 p-2 gap-4 flex justify-between">
          <button
            className="bg-blue-600 text-white px-4 py-2 font-semibold text-xs rounded-lg flex gap-1 "
            onClick={() => setAllCompleted(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
              />
            </svg>
            Select all
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 font-semibold text-xs rounded-lg flex gap-1"
            onClick={() => setAllCompleted(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
              />
            </svg>
            cancel
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
