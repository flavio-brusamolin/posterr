import { User } from '../../../../domain/entities/user'

export interface UpdateUserRepository {
  updateUser: (userId: string, user: User) => Promise<User>
}
