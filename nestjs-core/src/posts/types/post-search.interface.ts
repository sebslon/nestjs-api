export interface PostSearchBody {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export interface PostCountResult {
  count: number;
}
