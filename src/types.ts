export interface Tag {
  id: number;
  name: string;
  color: string; // hex value e.g. "#3b82f6"
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  tagId: number | null;
}
