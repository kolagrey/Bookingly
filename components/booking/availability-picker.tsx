import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { availabilityService } from '@/lib/api/availability-service'
import { type TimeSlot } from '@/types/database'

interface AvailabilityPickerProps {
  expertId: string
  onSlotSelect: (slot: TimeSlot) => void
}

export function AvailabilityPicker({ expertId, onSlotSelect }: AvailabilityPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )

  // Get list of all IANA timezones
  const timezones = Intl.supportedValuesOf('timeZone')

  useEffect(() => {
    if (selectedDate && expertId) {
      availabilityService
        .getExpertAvailability(expertId, selectedDate, selectedTimezone)
        .then(setAvailableSlots)
    }
  }, [selectedDate, expertId, selectedTimezone])

  // Subscribe to real-time updates
  useEffect(() => {
    if (expertId) {
      const unsubscribe = availabilityService.subscribeToAvailabilityUpdates(
        expertId,
        (slots) => setAvailableSlots(slots)
      )
      return () => unsubscribe()
    }
  }, [expertId])

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = utcToZonedTime(new Date(`2000-01-01T${slot.start}`), selectedTimezone)
    const end = utcToZonedTime(new Date(`2000-01-01T${slot.end}`), selectedTimezone)
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Timezone</label>
        <Select
          value={selectedTimezone}
          onValueChange={setSelectedTimezone}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />

      {selectedDate && (
        <div className="grid gap-2">
          <h3 className="font-semibold">
            Available Slots for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSlotSelect(slot)}
              >
                {formatTimeSlot(slot)}
              </Button>
            ))}
            {availableSlots.length === 0 && (
              <p className="col-span-2 text-center text-muted-foreground">
                No available slots for this date
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}