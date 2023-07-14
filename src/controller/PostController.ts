import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { GetUsersSchema } from "../dtos/getUsers.dto"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { LoginSchema } from "../dtos/login.dto"
import { SignupInputDTO, SignupSchema } from "../dtos/signup.dto"
import { GetCommentLikeSchema, GetCommentsInputSchema, GetNewCommentInputSchema, GetPostsDeleteSchema, GetPostsInputSchema, GetPostsLikeSchema, GetPostsPutSchema, GetPostsSchema } from "../dtos/getPosts.dto"
import { PostBusiness } from "../business/PostBusiness"
import { TokenManager } from "../services/TokenManager"

export class Postcontroller {
  constructor(
    private postBusiness: PostBusiness
  ) { }

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = GetPostsInputSchema.parse({
        // q: req.query.q,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.getPosts(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }
  public getComments = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsInputSchema.parse({
        postId: req.params.postId,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.getComments(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public createPost = async (req: Request, res: Response) => {
    try {
      const tokenManager = new TokenManager()
      const token = req.headers.authorization
      const payload = tokenManager.getPayload(token as string)
      const creator_id = req.body.creatorId || payload?.id

      const input = GetPostsSchema.parse({
        token: req.headers.authorization,
        creatorId: creator_id,
        content: req.body.content
      })

      const output = await this.postBusiness.createPost(input)
      console.log(output)

      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public createComment = async (req: Request, res: Response) => {
    try {
      const tokenManager = new TokenManager()
      const token = req.headers.authorization
      const payload = tokenManager.getPayload(token as string)
      const user_id = req.body.creatorId || payload?.id

      const input = GetNewCommentInputSchema.parse({
        token,
        postId: req.params.postId,
        userId: user_id,
        content: req.body.content
      })

      const output = await this.postBusiness.createComment(input)
      console.log(output)

      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public likePost = async (req: Request, res: Response) => {
    try {
      const input = GetPostsLikeSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
        like: req.body.like
      })

      const output = await this.postBusiness.likePost(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public likeComment = async (req: Request, res: Response) => {
    try {
      const input = GetCommentLikeSchema.parse({
        commentId: req.params.commentId,
        token: req.headers.authorization,
        like: req.body.like
      })

      const output = await this.postBusiness.likeComment(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public editPost = async (req: Request, res: Response) => {
    try {
      const input = GetPostsPutSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
        content: req.body.content
      })
      const output = await this.postBusiness.editPost(input)
      console.log(output)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = GetPostsDeleteSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.deletePost(input)
      console.log(output)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

}