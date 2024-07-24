export class Traveller {
  constructor(
    public readonly email: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly dateOfBirth?: Date,
    public readonly nationality?: string,
    public readonly mealPreference?: string,
    public readonly passportNo?: string,
    public readonly passportNationality?: string,
    public readonly passportExpiry?: Date,
    public readonly phone?: string,
    public readonly _id?: string,
    public readonly gender?: string,
 
  ) {}
}
