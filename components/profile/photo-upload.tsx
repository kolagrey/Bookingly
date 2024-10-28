import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { profileService } from '@/lib/api/profile-service'
import { useToast } from '@/components/ui/use-toast'

interface PhotoUploadProps {
  userId: string
  currentPhotoUrl?: string
  userName: string
  onUpload: (url: string) => void
}

export function PhotoUpload({
  userId,
  currentPhotoUrl,
  userName,
  onUpload,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsUploading(true)
      const { data, error } = await profileService.uploadProfilePhoto(userId, file)
      
      if (error) throw error
      
      if (data?.publicUrl) {
        onUpload(data.publicUrl)
        toast({
          title: 'Photo uploaded',
          description: 'Your profile photo has been updated.',
        })
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentPhotoUrl} alt={userName} />
        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <Button
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload photo'}
        </Button>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-sm text-muted-foreground">
          Recommended: Square image, at least 400x400px
        </p>
      </div>
    </div>
  )
}