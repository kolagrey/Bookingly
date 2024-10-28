import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimeSlotPicker } from '@/components/time-slot-picker'

describe('TimeSlotPicker', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders add slot button', () => {
    render(<TimeSlotPicker onChange={mockOnChange} />)
    expect(screen.getByText('Add Time Slot')).toBeInTheDocument()
  })

  it('adds a new time slot when clicking add button', async () => {
    render(<TimeSlotPicker onChange={mockOnChange} />)
    await userEvent.click(screen.getByText('Add Time Slot'))
    
    expect(screen.getByDisplayValue('09:00')).toBeInTheDocument()
    expect(screen.getByDisplayValue('17:00')).toBeInTheDocument()
    expect(mockOnChange).toHaveBeenCalledWith([
      { start: '09:00', end: '17:00' },
    ])
  })

  it('removes a time slot', async () => {
    render(<TimeSlotPicker onChange={mockOnChange} />)
    await userEvent.click(screen.getByText('Add Time Slot'))
    await userEvent.click(screen.getByText('Remove'))
    
    expect(screen.queryByDisplayValue('09:00')).not.toBeInTheDocument()
    expect(mockOnChange).toHaveBeenCalledWith([])
  })
})