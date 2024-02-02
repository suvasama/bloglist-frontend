import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null})

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs( blogs )
    }
    getBlogs()
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })
    setTimeout(() => {
      setInfo({ message: null} )
    }, 3000)
  }

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      notifyWith('Wrong username or password', 'error')
    }
  }
  const handleLogOut = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    blogService.setToken('')
  }

  const addBlog = async ( blogObject ) => {
    blogFormRef.current.toggleVisibility()
    const blog = await blogService
      .create(blogObject)
    setBlogs(blogs.concat(blog))
    notifyWith(`a new blog ${blog.title} by ${blog.author} added`)
  }

  const addLike = async ( blogId, blogObject ) => {
    const updatedBlog = await blogService
      .update(blogId, blogObject)
    setBlogs(blogs.map(b => b.id !== blogId ? b :updatedBlog ))
  }
  
  const removeBlog = async ( blog ) => {
    const ok = window.confirm(`remove blog ${blog.title} by ${blog.author}?`)
      if ( ok ) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notifyWith(`Blog ${blog.title} deleted!`)
    }
  }
  
  const blogFormRef = useRef()
  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef} >
          <h2>create new</h2>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
  )}
  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification info={info}/>
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }
  
  return (
    <div>
      <div>
      <h2>blogs</h2>
        <Notification info={info}/>
          <p>
            {user.name} logged in <button onClick={handleLogOut}>logout</button>
          </p>
        </div>
      {blogForm()}
      <div>
        {blogs.sort((a, b) => a.likes - b.likes).map(blog =>
          <Blog key={blog.id} 
            blog={blog}
            user={user}
            clickLike={addLike} 
            clickRemove={removeBlog} 
          />
        )}
      </div>
    </div>
  )
}

export default App