import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookingWizard } from '@/components/booking/booking-wizard'
import { bookingService } from '@/lib/api/booking-service'

jest.mock('@/lib/api/booking-service')
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('BookingWizard', () => {
  const mockExpert = {
    id: 'expert-1',
    full_name: 'Test Expert',
    hourly_rate: 100,
    preferred_currency: 'USD',
  }

  const mockUser = {
    id: 'user-1',
    full_name: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders initial datetime step', () => {
    render(<BookingWizard expert={mockExpert} user={mockUser} />)
    
    expect(screen.getByText(/Select a date/i)).toBeInTheDocument()
    expect(screen.getByText(/Continue/i)).toBeDisabled()
  })

  it('progresses through booking steps', async () => {
    render(<BookingWizard expert={mockExpert} user={mockUser} />)

    // Select time slot
    const slot = { start: '09:00', end: '10:00' }
    fireEvent.click(screen.getByText('9:00 AM - 10:00 AM'))
    
    // Continue to session config
    fireEvent.click(screen.getByText('Continue'))
    await waitFor(() => {
      expect(screen.getByText(/Session Duration/i)).toBeInTheDocument()
    })

    // Continue to payment
    fireEvent.click(screen.getByText('Continue'))
    await waitFor(() => {
      expect(screen.getByText(/Select Payment Method/i)).toBeInTheDocument()
    })

    // Continue to summary
    fireEvent.click(screen.getByText('Continue'))
    await waitFor(() => {
      expect(screen.getByText(/Booking Summary/i)).toBeInTheDocument()
    })
  })

  it('creates booking successfully', async () => {
    ;(bookingService.createBooking as jest.Mock).mockResolvedValue({
      data: {
        id: 'booking-1',
        start_time: '2023-12-25T09:00:00Z',
      },
    })

    render(<BookingWizard expert={mockExpert} user={mockUser} />)

    // Navigate to summary
    // ... (previous steps)

    // Confirm booking
    fireEvent.click(screen.getByText('Confirm Booking'))

    await waitFor(() => {
      expect(bookingService.createBooking).toHaveBeenCalled()
      expect(screen.getByText(/Booking confirmed/i)).toBeInTheDocument()
    })
  })

  it('handles booking errors', async () => {
    ;(bookingService.createBooking as jest.Mock).mockRejectedValue(
      new Error('Booking failed')
    )

    render(<BookingWizard expert={mockExpert} user={mockUser} />)

    // Navigate to summary
    // ... (previous steps)

    // Attempt to confirm booking
    fireEvent.click(screen.getByText('Confirm Booking'))

    await waitFor(() => {
      expect(screen.getByText(/Failed to create booking/i)).toBeInTheDocument()
    })
  })
})