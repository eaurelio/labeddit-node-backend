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

  public async updatePost(post_id: string, like: boolean, user_id: string) {
    await BaseDatabase
      .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
      .update({like})
      .where({post_id, user_id})
  }

  public async deleteLikeUnlike(post_id: string, user_id: string) {
    await BaseDatabase
      .connection(LikesDislikesDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({post_id, user_id})
  }

  
}