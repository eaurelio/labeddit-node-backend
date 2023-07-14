import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { Postcontroller } from "../controller/PostController"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"
import { PostBusiness } from "../business/PostBusiness"
import { PostDatabase } from "../database/PostDatabase"
import { LikesDislikesDatabase } from "../database/LikesDislikesDatabase"

export const postRouter = express.Router()

const postController = new Postcontroller(
  new PostBusiness(
    new PostDatabase(),
    new TokenManager(),
    new IdGenerator(),
    new UserDatabase(),
    new LikesDislikesDatabase()
  )
)


postRouter.get("/", postController.getPosts)
postRouter.get("/comment/:postId", postController.getComments)
postRouter.post("/", postController.createPost)
postRouter.post("/comment/:postId", postController.createComment)
postRouter.put("/:id", postController.editPost)
postRouter.put("/:id/like", postController.likePost)
postRouter.put("/comment/:commentId/like", postController.likeComment)
postRouter.delete("/:id", postController.deletePost)
