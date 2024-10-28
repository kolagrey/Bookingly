import { render, screen, fireEvent } from '@testing-library/react'
import { StarRating } from '@/components/reviews/star-rating'

describe('StarRating', () => {
  it('renders correct number of stars', () => {
    render(<StarRating value={3} />)
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5)
  })

  it('highlights correct number of stars', () => {
    render(<StarRating value={4} />)
    const stars = screen.getAllByRole('button')
    
    stars.slice(0, 4).forEach(star => {
      expect(star).toHaveClass('text-yellow-400')
    })
    
    expect(stars[4]).toHaveClass('text-muted-foreground')
  })

  it('calls onChange when clicking stars', () => {
    const onChange = jest.fn()
    render(<StarRating value={0} onChange={onChange} />)
    
    const stars = screen.getAllByRole('button')
    fireEvent.click(stars[2])
    
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('disables interaction in readonly mode', () => {
    const onChange = jest.fn()
    render(<StarRating value={3} onChange={onChange} readonly />)
    
    const stars = screen.getAllByRole('button')
    fireEvent.click(stars[2])
    
    expect(onChange).not.toHaveBeenCalled()
    expect(stars[0]).toBeDisabled()
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<StarRating value={3} size="sm" />)
    expect(screen.getAllByRole('button')[0].firstChild).toHaveClass('w-4 h-4')
    
    rerender(<StarRating value={3} size="lg" />)
    expect(screen.getAllByRole('button')[0].firstChild).toHaveClass('w-6 h-6')
  })
})