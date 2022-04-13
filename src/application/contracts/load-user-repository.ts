import { User } from '../../domain/entities/user'

export interface LoadUserRepository {
  loadUser: (userId: string) => Promise<User>
}
