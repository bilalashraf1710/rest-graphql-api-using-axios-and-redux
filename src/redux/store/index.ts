import { combineReducers, configureStore } from '@reduxjs/toolkit';
import postsReducer from '../slices/postSlice';

const rootReducer = combineReducers({
  posts: postsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
