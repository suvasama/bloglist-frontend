import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from '../src/components/BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const input0 = screen.getByPlaceholderText('type blog title here')
  const input1 = screen.getByPlaceholderText('type author name here')
  const input2 = screen.getByPlaceholderText('type url here')
  const sendButton = screen.getByText('create')

  await user.type(input0, 'Testiblogi')
  await user.type(input1, 'Testi Kirjoittaja')
  await user.type(input2, 'https://www.testiblogi.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testiblogi')
  expect(createBlog.mock.calls[0][0].author).toBe('Testi Kirjoittaja')
  expect(createBlog.mock.calls[0][0].url).toBe('https://www.testiblogi.com')
})