export class User {
  constructor(
    public readonly email: string,
    public readonly name?: string,
    public readonly isVerified?: boolean,
    public password?: string,
    public readonly _id?: string,
    public readonly birthday?: Date,
    public readonly gender?:String,
    public readonly address?:string,
    public readonly state?:String,
    public readonly pincode?:Number,
    public readonly image_link?:String,

  ) {}
}
