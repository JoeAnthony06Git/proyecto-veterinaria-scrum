export type Role = 'TUTOR' | 'DOCTOR';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public password: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
