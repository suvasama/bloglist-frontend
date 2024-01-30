import { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      notifyWith('Wrong username or password', 'error')
    }
    setUsername('')
    setPassword('')
  }
  const handleLogOut = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    blogService.setToken('')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blog = await blogService
      .create({
        title: newTitle,
        author: newAuthor,
        url: newUrl
      })
    setBlogs(blogs.concat(blog))
    notifyWith(`a new blog ${newTitle} by ${newAuthor} added`)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification info={info}/>
        <LoginForm 
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info}/>
        <p>
          {user.name} logged in <button onClick={handleLogOut}>logout</button>
        </p>
      <h2>create new</h2>
      <BlogForm
        blogs={blogs}
        onSubmit={addBlog}
        newTitle={newTitle}
        newAuthor={newAuthor}
        newUrl={newUrl}
        setNewTitle={setNewTitle}
        setNewAuthor={setNewAuthor}
        setNewUrl={setNewUrl}
      />
    </div>
  )
}

export default App