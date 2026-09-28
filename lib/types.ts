export type Deadline = {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  type: "과제" | "시험";
  done: boolean;
};
