import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AvailabilityPicker } from '@/components/booking/availability-picker'
import { availabilityService } from '@/lib/api/availability-service'

jest.mock('@/lib/api/availability-service')

describe('AvailabilityPicker', () => {
  const mockSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
  ]

  const mockOnSlotSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(availabilityService.getExpertAvailability as jest.Mock).mockResolvedValue(mockSlots)
    ;(availabilityService.subscribeToAvailabilityUpdates as jest.Mock).mockReturnValue(
      () => {}
    )
  })

  it('renders timezone selector and calendar', () => {
    render(
      <AvailabilityPicker
        expertId="expert-1"
        onSlotSelect={mockOnSlotSelect}
      />
    )

    expect(screen.getByText('Timezone')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /choose/i })).toBeInTheDocument()
  })

  it('loads available slots when date is selected', async () => {
    render(
      <AvailabilityPicker
        expertId="expert-1"
        onSlotSelect={mockOnSlotSelect}
      />
    )

    const dateButton = screen.getByRole('button', { name: /choose/i })
    fireEvent.click(dateButton)

    await waitFor(() => {
      expect(availabilityService.getExpertAvailability).toHaveBeenCalled()
    })

    expect(screen.getByText('9:00 AM - 10:00 AM')).toBeInTheDocument()
  })

  it('calls onSlotSelect when slot is clicked', async () => {
    render(
      <AvailabilityPicker
        expertId="expert-1"
        onSlotSelect={mockOnSlotSelect}
      />
    )

    const dateButton = screen.getByRole('button', { name: /choose/i })
    fireEvent.click(dateButton)

    await waitFor(() => {
      const slot = screen.getByText('9:00 AM - 10:00 AM')
      fireEvent.click(slot)
    })

    expect(mockOnSlotSelect).toHaveBeenCalledWith(mockSlots[0])
  })

  it('updates slots when timezone changes', async () => {
    render(
      <AvailabilityPicker
        expertId="expert-1"
        onSlotSelect={mockOnSlotSelect}
      />
    )

    const timezoneSelect = screen.getByRole('combobox')
    fireEvent.change(timezoneSelect, { target: { value: 'America/New_York' } })

    await waitFor(() => {
      expect(availabilityService.getExpertAvailability).toHaveBeenCalledWith(
        'expert-1',
        expect.any(Date),
        'America/New_York'
      )
    })
  })

  it('subscribes to real-time updates', () => {
    render(
      <AvailabilityPicker
        expertId="expert-1"
        onSlotSelect={mockOnSlotSelect}
      />
    )

    expect(availabilityService.subscribeToAvailabilityUpdates).toHaveBeenCalledWith(
      'expert-1',
      expect.any(Function)
    )
  })
})