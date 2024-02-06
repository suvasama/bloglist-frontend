import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <>
      <form onSubmit={addBlog}>
        <div>
        title: <input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder='type blog title here'
          />
        </div>
        <div>
        author: <input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder='type author name here'
          />
        </div>
        <div>
        url: <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder='type url here'
          />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </>
  )}

export default BlogForm