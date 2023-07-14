import { LikesDislikesDB } from "../models/LikesDisLikes";
import { BaseDatabase } from "./BaseDatabase";
import { PostDatabase } from "./PostDatabase";

export class LikesDislikesDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKES_DISLIKES = "likes_dislikes"

  public async getLikedPost(postId: string): Promise<LikesDislikesDB[]> {
    const result: LikesDislikesDB[] = await BaseDatabase
      .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
      .where({post_id: postId})

    const LikesDislikes = result
    return LikesDislikes
  }

  public async getLikedPostById(userId: string, postId: string): Promise<LikesDislikesDB[]> {
    const result: LikesDislikesDB[] = await BaseDatabase
    .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
    .where({user_id: userId, post_id: postId})

    return result
  }

  // public async getLikedCommentById(userId: string, postId: string): Promise<LikesDislikesDB[]> {
  //   const result: LikesDislikesDB[] = await BaseDatabase
  //   .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
  //   .where({user_id: userId, post_id: postId})

  //   return result
  // }

  public async likeUnlikePost(post: object) {
    await BaseDatabase
      .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
      .insert(post)    
  }

  public async updatePost(postId: string, value: boolean) {
    await BaseDatabase
      .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
      .update({like: value})
      .where({post_id: postId})
  }

  public async deleteLikeUnlike(post_id: string) {
    await BaseDatabase
      .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({post_id: post_id})
  }

  
}