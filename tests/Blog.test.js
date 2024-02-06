import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from '../src/components/Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Kallen oma blogi',
    author: 'Kalle Kirjoittaja',
    url: 'https://kallenomablogi.fi',
    likes: 5,
    user: { name: 'Kalle Kirjoittaja' }
  }
  const user = { name: 'Kalle Kirjoittaja' }
  const mockHandler = jest.fn()
  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} clickLike={mockHandler} />).container
  })
  test('renders title and author', async () => {
    await screen.findAllByText('Kallen oma blogi Kalle Kirjoittaja')
  })

  test('does not render url or number of likes by default', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('shows url and the number of likes after clicking the view button', async () => {
    const userHandler = userEvent.setup()
    const button = screen.getByText('view')
    await userHandler.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('the event handler is called twice if the like button is clicked twice', async () => {
    const userHandler = userEvent.setup()
    const button = screen.getByText('like')
    await userHandler.click(button)
    await userHandler.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
