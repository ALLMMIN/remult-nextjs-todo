import { remultNext } from "remult/remult-next";
import Task from "../shared/Task";
import  TasksController  from "../shared/TasksController";
import { getUserFromNextAuth } from "./auth/[...nextauth]";
import { createPostgresConnection } from "remult/postgres";

export default remultNext({
  controllers: [TasksController],
  entities: [Task],
  getUser: getUserFromNextAuth,
  dataProvider: createPostgresConnection(),
});
