import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${baseUrl}/${id}`
  const request = axios.put(url, updatedObject, config)
  const response = await request
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${baseUrl}/${id}`
  const request = axios.delete(url, config)
  const response = await request
  return response.data
}

export default { getAll, create, update, remove, setToken }