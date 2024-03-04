// // src/app/api/[...remult]/route.ts

// import { remultNextApp } from "remult/remult-next";
// const api = remultNextApp({});
// export const { POST, PUT, DELETE, GET } = api;

import { remultNext } from "remult/remult-next";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";
import { getUserFromNextAuth } from "./auth/[...nextauth]";
import { createPostgresConnection } from "remult/postgres"

export default remultNext({
  controllers: [TasksController],
  entities: [Task],
  getUser: getUserFromNextAuth,
  dataProvider:createPostgresConnection()
});
