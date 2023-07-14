import z from "zod"
import { PostModel } from "../models/Posts"

export interface GetPostsInputDTO {
  token: string
  creatorId: string
  content: string
}

export interface GetPostsPutDTO {
  token: string
  postId: string
  content: string
}

export interface GetPostsDeleteDTO {
  token: string
  postId: string
}

export interface GetPostsLikeDTO {
  postId: string
  token: string
  like: boolean
}

export interface GetCommentsLikeDTO {
  commentId: string
  token: string
  like: boolean
}

export interface GetCommentsInputDTO {
  token: string
  postId: string
}

export interface GetNewCommentInputDTO {
  token: string
  postId: string,
  userId: string,
  content: string
}

// UserModel é a estrutura de User que será devolvida para o Front (sem password)
export type GetPostsOutputDTO = PostModel[]

export const GetPostsSchema = z.object({
  token: z.string().min(1),
  creatorId: z.string().min(1),
  content: z.string().min(1)
}).transform(data => data as GetPostsInputDTO)

export const GetPostsInputSchema = z.object({
  token: z.string().min(1)
}).transform(data => data as GetPostsInputDTO)

export const GetCommentsInputSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1),
}).transform(data => data as GetCommentsInputDTO)

export const GetNewCommentInputSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1),
  userId: z.string().min(1),
  content: z.string().min(1)
}).transform(data => data as GetNewCommentInputDTO)

export const GetCommentLikeSchema = z.object({
  token: z.string().min(1),
  commentId: z.string().min(1),
  like: z.boolean()
}).transform(data => data as GetCommentsLikeDTO)

export const GetPostsPutSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1),
  content: z.string().min(1)
}).transform(data => data as GetPostsPutDTO)

export const GetPostsDeleteSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1)
}).transform(data => data as GetPostsDeleteDTO)

export const GetPostsLikeSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1),
  like: z.boolean()
}).transform(data => data as GetPostsLikeDTO)