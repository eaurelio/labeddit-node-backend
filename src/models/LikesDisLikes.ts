export interface LikesDislikesDB {
  userId: string,
  postId: string,
  like: boolean
}

export interface LikesDislikesModel {
  userId: string,
  postId: string,
  like: boolean
}

export class LikesDislikes {
  constructor(
    private userId: string,
    private postId: string,
    private like: boolean
  ) { }

  public getId(): string { return this.userId }
  public setId(value: string): void { this.userId = value }

  public getPostId(): string { return this.postId }
  public setPostId(value: string): void { this.postId = value }

  public getLike(): boolean { return this.like }
  public setLike(value: boolean): void { this.like = value }

  public toDBModel(): LikesDislikesDB {
    return {
      userId: this.userId,
      postId: this.postId,
      like: this.like
    }
  }

  public toBusinessModel(): LikesDislikesModel {
    return {
      userId: this.userId,
      postId: this.postId,
      like: this.like
    }
  }
}