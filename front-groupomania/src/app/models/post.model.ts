export class Post {
    user!: any;
    userId!: number;
    postId!: number;
    createdAt!: Date;
    updatedAt!: Date;
    media? : string;
    content!: string;
    likeposts!: any;
    likes!: number;
    dislikes!: number
}