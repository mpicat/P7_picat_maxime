export class Post {
    postId!: number;
    userId!: number;
    content!: string;
    media? : string;
    createdAt!: Date;
    updatedAt!: Date;
    likes!: number;
    dislikes!: number;
    userName!: any;
    likeposts!: any;
    comments!: any;
}