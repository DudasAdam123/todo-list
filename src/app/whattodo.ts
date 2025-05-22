export interface Todo {
  id: string;
  title: string;
  category: string;
  status: "active" | "finished";
  priority: "low" | "medium" | "urgent";
  ToBeCompleted: Date;
}

 export interface Category {
  id: string;
  name: string;
}