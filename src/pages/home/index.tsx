import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classes from './style.module.css'
import NetworkManager from '../../services/network-manager'
import { IPost } from '../../mocks/data'
import { RootState } from '../../redux/store/index'
import { setGqlPosts, setRestPosts } from '../../redux/slices/postSlice'

const Home: React.FC = () => {
  const dispatch = useDispatch()
  const gqlPosts = useSelector((state: RootState) => state.posts.gqlPosts)
  const restPosts = useSelector((state: RootState) => state.posts.restPosts)

  const getPostsWRest = async () => {
    const mockResponse = await NetworkManager.getPosts()
    dispatch(setRestPosts([...mockResponse.data]))
  }

  const deleteWRestOnClickHandler = async (id: number) => {
    await NetworkManager.deletePost(id)
    dispatch(setRestPosts([...restPosts.filter((d: IPost) => d.id !== id)]))
  }

  const updateWRestOnClickHandler = async (id: number, postData: IPost) => {
    const response = await NetworkManager.updatePost(id, postData)
    const updatedPost = response.data
    const updatedPosts = restPosts.map((d: IPost) =>
      d.id === updatedPost.id ? updatedPost : d
    )
    dispatch(setRestPosts(updatedPosts))
  }

  const addNewPostWRestClickHandler = async (title: string, body: string) => {
    const response = await NetworkManager.addPost({ title, body })
    const newPost = response.data
    dispatch(setRestPosts([...restPosts, newPost]))
  }

  const getPostsWGql = async () => {
    const query = `
    query GetPosts{
      Post {
        id
        title
      }
    }
    `
    const mockResponse = await NetworkManager.graphql(query)
    dispatch(setGqlPosts([...mockResponse.data.data.posts]))
  }

  const updatePostWGql = async (id: number, title: string, body: string) => {
    try {
      const mutation = `
      mutation UpdatePost($id: ID!, $title: String!, $body: String!) {
        updatePost(id: $id, title: $title, body: $body) {
          id
          title
          body
        }
      }
    `
      const variables = {
        id,
        title,
        body,
      }

      const response = await NetworkManager.graphql(mutation, variables)
      const updatedPost = response.data.data.updatePost
      const updatedPosts = gqlPosts.map((d: IPost) =>
        d.id === updatedPost.id ? updatedPost : d
      )
      dispatch(setGqlPosts(updatedPosts))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deletePostWGql = async (id: number) => {
    try {
      const mutation = `
      mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
          id
          title
          body
        }
      }
    `
      const variables = {
        id,
      }
      await NetworkManager.graphql(mutation, variables)
      dispatch(setGqlPosts([...gqlPosts.filter((d: IPost) => d.id !== id)]))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const addPostWGql = async (title: string, body: string) => {
    try {
      const mutation = `
        mutation AddPost($title: String!, $body: String!) {
          addPost(title: $title, body: $body) {
            id
            title
            body
          }
        }
      `
      const variables = {
        title,
        body,
      }
      const response = await NetworkManager.graphql(mutation, variables)
      const newPost = response.data.data.addPost
      dispatch(setGqlPosts([...gqlPosts, newPost]))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getPostsWGql()
    getPostsWRest()
    // eslint-disable-next-line
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.postFeed}>
        <span>Graphql Api Data</span>
        {gqlPosts.map((d: IPost) => (
          <div className={classes.post} key={d.id}>
            <div>{d.title}</div>
            <div>{d.body}</div>
            <button onClick={() => deletePostWGql(d.id)}>Delete</button>
            <button
              onClick={() =>
                updatePostWGql(d.id, 'title update', 'content updated')
              }
            >
              Edit
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            addPostWGql(
              'newly added post title',
              'hey there we have added this new post'
            )
          }
        >
          Add New Post
        </button>
      </div>

      <div className={classes.postFeed}>
        <span>Rest Api Data</span>
        {restPosts.map((d: IPost) => (
          <div className={classes.post} key={d.id}>
            <div>{d.title}</div>
            <div>{d.body}</div>
            <button onClick={() => deleteWRestOnClickHandler(d.id)}>
              Delete
            </button>
            <button
              onClick={() =>
                updateWRestOnClickHandler(d.id, {
                  id: d.id,
                  title: 'rest title updated',
                  body: 'rest body content updated',
                })
              }
            >
              Edit
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            addNewPostWRestClickHandler(
              'newly added post title',
              'hey there we have added this new post'
            )
          }
        >
          Add New Post
        </button>
      </div>
    </div>
  )
}

export default Home
