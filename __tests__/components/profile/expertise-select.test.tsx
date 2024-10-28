import { render, screen, fireEvent } from '@testing-library/react'
import { ExpertiseSelect } from '@/components/profile/expertise-select'
import { useQuery } from '@tanstack/react-query'

jest.mock('@tanstack/react-query')

describe('ExpertiseSelect', () => {
  const mockCategories = [
    { id: 'cat-1', name: 'Web Development' },
    { id: 'cat-2', name: 'Mobile Development' },
  ]

  const mockOnChange = jest.fn()
  const defaultProps = {
    value: [],
    onChange: mockOnChange,
  }

  beforeEach(() => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: mockCategories,
    })
  })

  it('renders expertise selection fields', () => {
    render(<ExpertiseSelect {...defaultProps} />)
    
    expect(screen.getByText('Add Expertise')).toBeInTheDocument()
  })

  it('adds new expertise field', () => {
    render(<ExpertiseSelect {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Add Expertise'))
    
    expect(mockOnChange).toHaveBeenCalledWith([{
      category_id: mockCategories[0].id,
      years_experience: 0,
    }])
  })

  it('removes expertise field', () => {
    render(
      <ExpertiseSelect
        value={[{
          category_id: 'cat-1',
          years_experience: 5,
        }]}
        onChange={mockOnChange}
      />
    )
    
    fireEvent.click(screen.getByText('Remove'))
    
    expect(mockOnChange).toHaveBeenCalledWith([])
  })

  it('updates expertise values', () => {
    render(
      <ExpertiseSelect
        value={[{
          category_id: 'cat-1',
          years_experience: 5,
        }]}
        onChange={mockOnChange}
      />
    )
    
    const yearsInput = screen.getByRole('spinbutton')
    fireEvent.change(yearsInput, { target: { value: '6' } })
    
    expect(mockOnChange).toHaveBeenCalledWith([{
      category_id: 'cat-1',
      years_experience: 6,
    }])
  })

  it('disables inputs when disabled prop is true', () => {
    render(<ExpertiseSelect {...defaultProps} disabled />)
    
    expect(screen.getByText('Add Expertise')).toBeDisabled()
  })
})