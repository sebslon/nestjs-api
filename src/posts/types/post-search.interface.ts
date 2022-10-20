export interface PostSearchBody {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

// export interface PostSearchResult {
//   hits: {
//     total: number;
//     hits: {
//       _source: PostSearchBody;
//     }[];
//   };
// }
