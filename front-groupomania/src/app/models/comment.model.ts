export class Comment {
    user!: any;
    userId!: number;
    commentId!: number;
    postId!: number;
    createdAt!: Date;
    updatedAt!: Date;
    media? : string;
    content!: string;
    likecomments!: any;
    likes!: number;
    dislikes!: number
}