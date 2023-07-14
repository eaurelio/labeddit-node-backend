import { PostDB } from './../models/Posts';
import { promises } from "dns"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { GetCommentsLikeDTO, GetNewCommentInputDTO, GetPostsDeleteDTO, GetPostsInputDTO, GetPostsLikeDTO, GetPostsOutputDTO, GetPostsPutDTO } from "../dtos/getPosts.dto"
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/getUsers.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/login.dto"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/signup.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Posts"
import { TokenPayload, USER_ROLES, User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { LikesDislikesDatabase } from "../database/LikesDislikesDatabase"

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private tokenManager: TokenManager,
    private idGenerator: IdGenerator,
    private userDatabase: UserDatabase,
    private likesDislikesDatabase: LikesDislikesDatabase
  ) { }

  // BACKUP DA FUNÇÃO GETPOST ANTES DA IMPLEMENTAÇÃO DO ATRIBUTO USERNAME
  // public getPosts = async (input: any): Promise<GetPostsOutputDTO> => {
  //   const { token } = input

  //   const payload = this.tokenManager.getPayload(token)

  //   if (payload === null) {
  //     throw new BadRequestError('Token inválido')
  //   }

  //   const postsDB = await this.postDatabase.findPosts()

  //   const posts: any = postsDB.map((postDB) => {
  //     const post = new Post(
  //       postDB.id,
  //       postDB.creator_id,
  //       postDB.content,
  //       postDB.likes,
  //       postDB.dislikes,
  //       postDB.created_at,
  //       postDB.updated_at,

  //     )
  //     return post.toBusinessModel()
  //   })

  //   const output: GetPostsOutputDTO = posts
  //   return output
  // }

  public getPosts = async (input: any) : Promise<any> => {
    const { token } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError('Token inválido')
    }

    const postsDB = await this.postDatabase.findPosts()

    const userDatabase = new UserDatabase()

    async function getUserName (id : any)  {
      const name = await userDatabase.findUserById(id)
      return name?.name
    }

    const output = Promise.all(postsDB.map(async(post) => {
      const userName = await getUserName(post.creator_id)
      return {...post, userName}
    }))

    return output
  }

  public getComments = async (input: any) : Promise<any> => {
    const { token, postId } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError('Token inválido')
    }

    const postsDB = await this.postDatabase.findComments(postId)
    console.log(postsDB)

    const userDatabase = new UserDatabase()

    async function getUserName (id : any)  {
      const name = await userDatabase.findUserById(id)
      return name?.name
    }

    const output = Promise.all(postsDB.map(async(post) => {
      const userName = await getUserName(post.user_id)
      return {...post, userName}
    }))

    return output
  }

  public createPost = async (
    input: GetPostsInputDTO
  ): Promise<{}> => {

    const { token, creatorId, content } = input

    const isValidToken = await this.tokenManager.getPayload(token)

    if (!isValidToken) {
      throw new BadRequestError('Token inválido!')
    }

    const id = this.idGenerator.generate()
    const likes: number = 0
    const dislikes: number = 0
    const createdAt: string = new Date().toISOString()
    const updatedAt: string = new Date().toISOString()


    const newPost = new Post(
      id,
      creatorId,
      content,
      likes,
      dislikes,
      createdAt,
      updatedAt
    )

    const newPostDB = newPost.toDBModel()
    await this.postDatabase.createPost(newPostDB)

    const output = {
      content: newPostDB.content
    }
    return output
  }

  public createComment = async (
    input: GetNewCommentInputDTO
  ): Promise<{}> => {

    const { token, postId, userId, content } = input

    const isValidToken = await this.tokenManager.getPayload(token)

    if (!isValidToken) {
      throw new BadRequestError('Token inválido!')
    }

    const id = this.idGenerator.generate()
    const likes: number = 0
    const dislikes: number = 0

    const newComment = {
      id,
      post_id: postId,
      user_id: userId,
      likes,
      dislikes,
      content
    }

    await this.postDatabase.createComment(newComment)

    return 'Post Criado!'
  }

  public editPost = async (input: GetPostsPutDTO): Promise<any> => {
    const { postId, token, content } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError('Token inválido!')
    }

    console.log(payload.id)

    const post = await this.postDatabase.getPostById(postId)

    if (post.length === 0) {
      throw new BadRequestError('Post não encontrado!')
    }

    if (post[0].creator_id !== payload.id) {
      throw new BadRequestError('Apenas o proprietário do post pode editá-lo!')
    }

    await this.postDatabase.editPost(postId, content)

    const output = {
      content: content
    }
    return output
  }

  public likePost = async (input: GetPostsLikeDTO): Promise<any> => {
    const { postId, token, like } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError('Token inválido!')
    }

    const post = await this.postDatabase.getPostById(postId)

    if (post.length === 0) {
      throw new BadRequestError('Post não encontrado!')
    }

    // if (post[0].creator_id === payload.id) {
    //   throw new BadRequestError('Você não pode curtir seu próprio post!')
    // }

    const isThisUserLiked = await this.likesDislikesDatabase.getLikedPostById(payload.id, postId)
    // console.log(isThisUserLiked)

    if (like) {
      if (isThisUserLiked.length === 0) {
        const newLike = {
          user_id: payload.id,
          post_id: postId,
          like: 1
        }
        await this.likesDislikesDatabase.likeUnlikePost(newLike)

        const newNumberOfLikes = post[0].likes += 1
        await this.postDatabase.likePost(post[0].id, newNumberOfLikes)
      } else if (isThisUserLiked[0].like) {
        await this.likesDislikesDatabase.deleteLikeUnlike(postId)
        
        const newNumberOfLikes = post[0].likes -= 1
        await this.postDatabase.likePost(post[0].id, newNumberOfLikes)

      } 
      else {
        await this.likesDislikesDatabase.updatePost(postId, true)

        const newNumberOfLikes = post[0].likes += 1
        await this.postDatabase.likePost(post[0].id, newNumberOfLikes)
        
        const newNumberofDislikes = post[0].likes -= 1
        await this.postDatabase.unlikePost(post[0].id, newNumberofDislikes)
      }
      return 'Post alterado'
    }

    if (!like) {
      if (isThisUserLiked.length === 0) {
        const newLike = {
          user_id: payload.id,
          post_id: postId,
          like: 0
        }
        await this.likesDislikesDatabase.likeUnlikePost(newLike)

        const newNumberOfDislikes = post[0].dislikes += 1
        await this.postDatabase.unlikePost(post[0].id, newNumberOfDislikes)
      } else if (!isThisUserLiked[0].like) {
        await this.likesDislikesDatabase.deleteLikeUnlike(postId)

        const newNumberOfDislikes = post[0].dislikes -= 1
        await this.postDatabase.unlikePost(post[0].id, newNumberOfDislikes)

      } 
      else {
        await this.likesDislikesDatabase.updatePost(postId, false)

        const newNumberOfLikes = post[0].likes -= 1
        await this.postDatabase.likePost(post[0].id, newNumberOfLikes)

        const newNumberOfDislikes = post[0].dislikes += 1
        await this.postDatabase.unlikePost(post[0].id, newNumberOfDislikes)
      }
      console.log(post)
      return 'Post alterado'
    }
  }

  public likeComment = async (input: GetCommentsLikeDTO): Promise<any> => {
    const { commentId, token, like } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError('Token inválido!')
    }

    const comment = await this.postDatabase.getCommentById(commentId)

    if (comment.length === 0) {
      throw new BadRequestError('Post não encontrado!')
    }

    // if (comment[0].user_id === payload.id) {
    //   throw new BadRequestError('Você não pode curtir seu próprio post!')
    // }

    const isThisUserLiked = await this.likesDislikesDatabase.getLikedPostById(payload.id, commentId)
    // console.log(isThisUserLiked)

    if (like) {
      // Interação não existe
      if (isThisUserLiked.length === 0) {
        const newLike = {
          user_id: payload.id,
          post_id: commentId,
          like: 1
        }
        await this.likesDislikesDatabase.likeUnlikePost(newLike)

        const newNumberOfLikes = comment[0].likes += 1
        await this.postDatabase.likeComment(comment[0].id, newNumberOfLikes)
      }
      // Interação de like existe - Vira unlike
      else if (isThisUserLiked[0].like) {
        await this.likesDislikesDatabase.deleteLikeUnlike(commentId)
        
        const newNumberOfLikes = comment[0].likes -= 1
        await this.postDatabase.likeComment(comment[0].id, newNumberOfLikes)

      } 
      // Interação de unlike existe - Vira like
      else {
        await this.likesDislikesDatabase.updatePost(commentId, true)

        const newNumberOfLikes = comment[0].likes += 1
        await this.postDatabase.likeComment(comment[0].id, newNumberOfLikes)
        
        const newNumberofDislikes = comment[0].likes -= 1
        await this.postDatabase.unlikeComment(comment[0].id, newNumberofDislikes)
      }
      return 'Post alterado'
    }

    if (!like) {
       // Interação não existe
      if (isThisUserLiked.length === 0) {
        const newLike = {
          user_id: payload.id,
          post_id: commentId,
          like: 0
        }
        await this.likesDislikesDatabase.likeUnlikePost(newLike)

        const newNumberOfDislikes = comment[0].dislikes += 1
        await this.postDatabase.unlikeComment(comment[0].id, newNumberOfDislikes)
      } 
      // Interação de unlike existe - Vira like
      else if (!isThisUserLiked[0].like) {
        await this.likesDislikesDatabase.deleteLikeUnlike(commentId)

        const newNumberOfDislikes = comment[0].dislikes -= 1
        await this.postDatabase.unlikeComment(comment[0].id, newNumberOfDislikes)
      } 
      // Interação de like existe - Vira unlike
      else {
        await this.likesDislikesDatabase.updatePost(commentId, false)

        const newNumberOfLikes = comment[0].likes -= 1
        await this.postDatabase.likeComment(comment[0].id, newNumberOfLikes)

        const newNumberOfDislikes = comment[0].dislikes += 1
        await this.postDatabase.unlikeComment(comment[0].id, newNumberOfDislikes)
      }
      console.log(comment)
      return 'Post alterado'
    }
  }

  public deletePost = async (
    input: GetPostsDeleteDTO
  ): Promise<any> => {
    const { token, postId } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError('Token inválido!')
    }

    const post = await this.postDatabase.getPostById(postId)

    if (post.length === 0) {
      throw new BadRequestError('Post não encontrado!')
    }

    if (post[0].creator_id !== payload.id) {
      throw new BadRequestError('Apenas o proprietário do post pode excluí-lo')
    }

    await this.postDatabase.deletePost(postId)
    return 'Post deletado com sucesso!'
  }
}