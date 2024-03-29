import mongoose from 'mongoose'

export default {
  async connect (uri: string): Promise<void> {
    await mongoose.connect(uri)
  }
}
