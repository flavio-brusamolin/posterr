export interface CountTodayPostsRepository {
  countTodayPosts: (userId: string) => Promise<number>
}
