// export enum USER_ROLES {
//   NORMAL = "NORMAL",
//   ADMIN = "ADMIN"
// }

export interface PostDB {
  id: string,
  creator_id: string,
  content: string,
  likes: number,
  dislikes: number,
  created_at: string,
  updated_at: string
}

// é o modelo de User que o front receberá (sem password e createdAt camelCase)
// export interface PostModel {
//   id: string,
//   creator_id: string,
//   content: string,
//   likes: boolean,
//   dislikes: boolean,
//   created_at: string,
//   updated_at: string
// }
export interface PostModel {
  id: string,
  creator_id: string,
  content: string,
  likes: number,
  dislikes: number,
  created_at: string,
  updated_at: string
}

// export interface TokenPayload {
//   id: string,
//   name: string,
//   role: USER_ROLES
// }

export class Post {    
    constructor(
      private id: string,
      private creator_id: string,
      private content: string,
      private likes: number,
      private dislikes: number,
      private created_at: string,
      private updated_at: string
    ) {}

    public getId(): string {return this.id}    
    public setId(value: string): void {this.id = value}

    public getCreatorId(): string {return this.creator_id}
    public setCreatorID(value: string): void {this.creator_id = value}

    public getContent(): string {return this.content}
    public setContent(value: string): void {this.content = value}

    public getLikes():number {return this.likes}
    public setLikes(value: number): void {this.likes = value}

    public getDislikes():number {return this.dislikes}
    public setDislikes(value: number): void {this.dislikes = value}

    public getCreatedAt(): string {return this.created_at}
    public setCreatedAT(value: string): void {this.created_at = value}

    public getUploadedAt(): string {return this.updated_at}
    public setUploadedAt(value: string): void {this.updated_at = value}


    // para facilitar nossa vida, temos o método que gera um UserDB
    public toDBModel(): PostDB {
        return {
          id: this.id,
          creator_id: this.creator_id,
          content: this.content,
          likes: this.likes,
          dislikes: this.dislikes,
          created_at: this.created_at,
          updated_at: this.updated_at
        }
    }

    // para facilitar nossa vida, temos o método que gera um UserModel
    public toBusinessModel(): PostModel {
      return {
          id: this.id,
          creator_id: this.creator_id,
          content: this.content,
          likes: this.likes,
          dislikes: this.dislikes,
          created_at: this.created_at,
          updated_at: this.updated_at
      }
  }
    // public toBusinessModel(): PostModel {
    //     return {
    //         id: this.id,
    //         creator_id: this.creator_id,
    //         content: this.content,
    //         likes: this.likes,
    //         dislikes: this.dislikes,
    //         created_at: this.created_at,
    //         updated_at: this.updated_at
    //     }
    // }
}