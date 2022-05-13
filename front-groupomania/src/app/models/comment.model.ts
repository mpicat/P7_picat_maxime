export class Comment {
    commentId!: number;
    postId!: number;
    userId!: number;
    content!: string;
    media? : string;
    createdAt!: Date;
    updatedAt!: Date;
    likes!: number;
    dislikes!: number;
    userName!: string;
    likecomments!: any
}