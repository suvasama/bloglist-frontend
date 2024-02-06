import { useState } from 'react'

const Blog = ({ blog, user, clickLike, clickRemove }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = ( blog ) => {
    const blogObject = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    clickLike(blog.id, blogObject)
  }

  const showOwnBlog = { display: user.name === blog.user.name ? '' : 'none' }

  const showDetails = () => {
    return (
      <div style={showWhenVisible}  className='togglableContent'>
        <a href={blog.url}>{blog.url}</a>
        <div>likes {blog.likes} <button onClick={() => addLike(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        <button style={showOwnBlog} onClick={() => clickRemove(blog)}>remove</button>
      </div>
    )}

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button
        onClick={toggleVisibility} style={hideWhenVisible}>view</button> <button
        onClick={toggleVisibility} style={showWhenVisible} className='togglableContent'>hide
      </button>
      {showDetails()}
    </div>
  )}

export default Blog