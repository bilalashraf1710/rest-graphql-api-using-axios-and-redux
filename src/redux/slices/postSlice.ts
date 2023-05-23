import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPost } from '../../mocks/data'

interface PostsState {
  gqlPosts: IPost[]
  restPosts: IPost[]
}

const initialState: PostsState = {
  gqlPosts: [],
  restPosts: [],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setGqlPosts: (state, action: PayloadAction<IPost[]>) => {
      state.gqlPosts = action.payload
    },
    setRestPosts: (state, action: PayloadAction<IPost[]>) => {
      state.restPosts = action.payload
    },
  },
})

export const { setGqlPosts, setRestPosts } = postsSlice.actions

export default postsSlice.reducer
