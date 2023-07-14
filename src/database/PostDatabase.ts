import { PostDB } from "../models/Posts";
// import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_COMMENTS = "post_comments"

  public async getPostById(id: string): Promise<PostDB[]> {

    const result: PostDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .where({ id })

    const postsDB = result
    return postsDB
  }

  public async getCommentById(id: string): Promise<PostDB[]> {

    const result: PostDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_COMMENTS)
      .where({ id })

    const postsDB = result
    return postsDB
  }

  public async findPosts(): Promise<PostDB[]> {

    const result: PostDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)

    const postsDB = result
    return postsDB
  }

  public async findComments(postId: string) : Promise<any[]> {

    const result = await BaseDatabase
      .connection(PostDatabase.TABLE_COMMENTS)
      .where({post_id: postId})

    const postsDB = result
    return postsDB
  }

  public async createPost(
    newPostDB: PostDB
  ): Promise<void> {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .insert(newPostDB)
  }

  public async createComment(
    newPostDB: any
  ): Promise<void> {
    await BaseDatabase
      .connection(PostDatabase.TABLE_COMMENTS)
      .insert(newPostDB)
  }

  public async editPost(
    id: string, newContent: string
    ): Promise<void> {
      console.log('id: ', id, 'content: ', newContent)

      await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update({content: newContent})
        .where({id: id})
    }

  public async likePost(postId: string, newNumberOfLikes: number){
    await BaseDatabase
    .connection(PostDatabase.TABLE_POSTS)
    .update({likes: newNumberOfLikes})
    .where({id: postId})
  }

  public async unlikePost(postId: string, newNumberOfDislikes: number){
    await BaseDatabase
    .connection(PostDatabase.TABLE_POSTS)
    .update({dislikes: newNumberOfDislikes})
    .where({id: postId})
  }

  public async likeComment(commentId: string, newNumberOfLikes: number){
    await BaseDatabase
    .connection(PostDatabase.TABLE_COMMENTS)
    .update({likes: newNumberOfLikes})
    .where({id: commentId})
  }

  public async unlikeComment(commentId: string, newNumberOfDislikes: number){
    await BaseDatabase
    .connection(PostDatabase.TABLE_COMMENTS)
    .update({dislikes: newNumberOfDislikes})
    .where({id: commentId})
  }

  public async deletePost(
    idToDelete: string
  ): Promise<any> {
    await BaseDatabase  
      .connection(PostDatabase.TABLE_POSTS)
      .delete()
      .where({id: idToDelete})
  }
}
