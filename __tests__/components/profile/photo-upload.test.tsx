import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PhotoUpload } from '@/components/profile/photo-upload'
import { profileService } from '@/lib/api/profile-service'

jest.mock('@/lib/api/profile-service')

describe('PhotoUpload', () => {
  const mockOnUpload = jest.fn()
  const defaultProps = {
    userId: 'user-1',
    currentPhotoUrl: 'https://test.com/photo.jpg',
    userName: 'Test User',
    onUpload: mockOnUpload,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders current photo and upload button', () => {
    render(<PhotoUpload {...defaultProps} />)
    
    expect(screen.getByAltText('Test User')).toBeInTheDocument()
    expect(screen.getByText(/Upload photo/i)).toBeInTheDocument()
  })

  it('handles file upload successfully', async () => {
    ;(profileService.uploadProfilePhoto as jest.Mock).mockResolvedValue({
      data: { publicUrl: 'https://test.com/new-photo.jpg' },
    })

    render(<PhotoUpload {...defaultProps} />)

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('photo-upload')

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith('https://test.com/new-photo.jpg')
    })
  })

  it('validates file type', async () => {
    render(<PhotoUpload {...defaultProps} />)

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByTestId('photo-upload')

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Please upload an image file/i)).toBeInTheDocument()
    })
  })

  it('validates file size', async () => {
    render(<PhotoUpload {...defaultProps} />)

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })
    const input = screen.getByTestId('photo-upload')

    fireEvent.change(input, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/smaller than 5MB/i)).toBeInTheDocument()
    })
  })

  it('handles upload errors', async () => {
    ;(profileService.uploadProfilePhoto as jest.Mock).mockResolvedValue({
      error: new Error('Upload failed'),
    })

    render(<PhotoUpload {...defaultProps} />)

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('photo-upload')

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Failed to upload photo/i)).toBeInTheDocument()
    })
  })
})