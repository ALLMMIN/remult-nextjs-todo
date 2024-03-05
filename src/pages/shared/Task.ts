import { Allow, Entity, Fields, Validators } from "remult";

@Entity("tasks", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: "admin",
  allowApiDelete: "admin",
})
class Task {
  @Fields.autoIncrement()
  id = 0;
  @Fields.string<Task>({
    allowApiUpdate: "admin",
    validate: (task) => {
      if (task.title.length < 3) throw Error("Too shot");
    },
  })
  title = "";
  @Fields.boolean()
  completed = false;
}

export default Task;
