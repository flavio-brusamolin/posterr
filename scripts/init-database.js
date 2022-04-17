db = db.getSiblingDB('posterr')

db.users.insertMany([
  {
    userId: '3341b936-9021-422b-999e-d8b40a5320a1',
    username: 'flavio',
    joinedAt: new Date(),
    followers: [],
    following: [],
    numberOfFollowers: 0,
    numberOfFollowing: 0,
    numberOfPosts: 0,
    postHistory: []
  },
  {
    userId: '3341b936-9021-422b-999e-d8b40a5320a2',
    username: 'logan',
    joinedAt: new Date(),
    followers: [],
    following: [],
    numberOfFollowers: 0,
    numberOfFollowing: 0,
    numberOfPosts: 0,
    postHistory: []
  },
  {
    userId: '3341b936-9021-422b-999e-d8b40a5320a3',
    username: 'grace',
    joinedAt: new Date(),
    followers: [],
    following: [],
    numberOfFollowers: 0,
    numberOfFollowing: 0,
    numberOfPosts: 0,
    postHistory: []
  },
  {
    userId: '3341b936-9021-422b-999e-d8b40a5320a4',
    username: 'noah',
    joinedAt: new Date(),
    followers: [],
    following: [],
    numberOfFollowers: 0,
    numberOfFollowing: 0,
    numberOfPosts: 0,
    postHistory: []
  }
])
