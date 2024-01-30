import Blog from './Blog'

const BlogForm = (props) => {
  return (
    <>
      <form onSubmit={props.onSubmit}>
      <div>
        title: <input 
          value={props.newTitle}
          onChange={({ target }) => props.setNewTitle(target.value)}
        />
      </div>
      <div>
        author: <input 
          value={props.newAuthor}
          onChange={({ target }) => props.setNewAuthor(target.value)}
        />
      </div>
      <div>
        url: <input 
          value={props.newUrl}
          onChange={({ target }) => props.setNewUrl(target.value)}
        />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
      {props.blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
)}

export default BlogForm