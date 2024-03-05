import { remultNext } from "remult/remult-next";
import { getUserFromNextAuth } from "./auth/[...nextauth]";
import { createPostgresConnection } from "remult/postgres";
import { TasksController } from "../../shared/TasksController";
import { Task } from "../../shared/Task";

export default remultNext({
  controllers: [TasksController],
  entities: [Task],
  getUser: getUserFromNextAuth,
  dataProvider: createPostgresConnection(),
});
