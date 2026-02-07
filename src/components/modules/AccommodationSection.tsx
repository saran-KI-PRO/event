import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox'; // Ensure Checkbox is imported
import { Hotel, Calendar } from 'lucide-react';
import type { AccommodationDetails } from '../../types';

interface AccommodationSectionProps {
  accommodation: AccommodationDetails;
  onUpdate: (accommodation: AccommodationDetails) => void;
  readonly?: boolean;
}

export const AccommodationSection = ({ accommodation, onUpdate, readonly = false }: AccommodationSectionProps) => {
  const [showDetails, setShowDetails] = useState(accommodation.required);

  const handleToggleRequired = (checked: boolean) => {
    setShowDetails(checked);
    onUpdate({
      ...accommodation,
      required: checked,
      name: checked ? accommodation.name : '',
      checkIn: checked ? accommodation.checkIn : null,
      checkOut: checked ? accommodation.checkOut : null
    });
  };

  const handleStatusCycle = () => {
    const statuses: AccommodationDetails['status'][] = ['booked', 'checked-in', 'checked-out'];
    const currentIndex = statuses.indexOf(accommodation.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onUpdate({ ...accommodation, status: nextStatus });
  };

  if (readonly) {
    if (!accommodation.required) return null;

    return (
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Hotel className="h-4 w-4" />
          Accommodation
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Hotel</p>
          <p className="font-medium">{accommodation.name || 'Not set'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Check-in</p>
            <p className="font-medium">
              {accommodation.checkIn ? new Date(accommodation.checkIn).toLocaleString() : 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Check-out</p>
            <p className="font-medium">
              {accommodation.checkOut ? new Date(accommodation.checkOut).toLocaleString() : 'Not set'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleStatusCycle}
          className="w-full"
        >
          <Hotel className="h-4 w-4 mr-2" />
          Status: {accommodation.status}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id="accommodationRequired"
          checked={accommodation.required}
          onCheckedChange={handleToggleRequired}
        />
        <Label htmlFor="accommodationRequired" className="font-medium cursor-pointer">
          Accommodation Required
        </Label>
      </div>

      {showDetails && (
        <div className="space-y-4 pl-7 border-l-2 border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="hotelName">
              <Hotel className="h-4 w-4 inline mr-1" />
              Hotel / Guest House Name
            </Label>
            <Input
              id="hotelName"
              placeholder="Enter hotel name"
              value={accommodation.name}
              onChange={(e) => onUpdate({ ...accommodation, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">
                <Calendar className="h-4 w-4 inline mr-1" />
                Check-in Date & Time
              </Label>
              <Input
                id="checkIn"
                type="datetime-local"
                value={accommodation.checkIn || ''}
                onChange={(e) => onUpdate({ ...accommodation, checkIn: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">
                <Calendar className="h-4 w-4 inline mr-1" />
                Check-out Date & Time
              </Label>
              <Input
                id="checkOut"
                type="datetime-local"
                value={accommodation.checkOut || ''}
                onChange={(e) => onUpdate({ ...accommodation, checkOut: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};