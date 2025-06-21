export interface BlogsResponse {
  id: string;
  title: string;
  createdAt: string|number|Date;
  tags: string[];
  description: string;
  userId:string|number;
  authorName?:string|null|undefined;
  visible?:boolean;
}
