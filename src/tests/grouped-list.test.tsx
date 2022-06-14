import { render, screen } from '@testing-library/react'
import { GroupedList } from '../components/GroupedList'

describe('GroupedList', () => {
  it.each([
    ['empty data', {}],
    ['one data object', { 'header 1': [] }],
    ['two data objects', { 'header 1': [], 'header 2': [] }],
  ])(`renders a collapsed accordion trigger for each header: case with %s`, (_, data) => {
    render(<GroupedList data={data} />)
    const headers = Object.keys(data)
    const triggers = screen.queryAllByRole('button', { expanded: false })
    expect(triggers).toHaveLength(headers.length)
  })

  it('renders data headers values as trigger button text', () => {
    const HEADER_TEXT = 'header 1'
    render(<GroupedList data={{ [HEADER_TEXT]: [] }} />)
    expect(screen.getByRole('button')).toContainHTML(`<span>${HEADER_TEXT}</span>`)
  })
})
