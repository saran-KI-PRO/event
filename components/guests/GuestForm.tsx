import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, X } from 'lucide-react';
import { TransportSection } from '../modules/TransportSection';
import { AccommodationSection } from '../modules/AccommodationSection';
import type { Guest, SubEvent, TransportDetails, AccommodationDetails } from '../../types';

interface GuestFormProps {
  onSubmit: (data: Omit<Guest, 'id' | 'eventId' | 'createdAt'>) => void;
  onCancel: () => void;
  subEvents: SubEvent[];
}

export const GuestForm = ({ onSubmit, onCancel, subEvents }: GuestFormProps) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [organization, setOrganization] = useState('');
  const [contact, setContact] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [subEventId, setSubEventId] = useState<string>('');

  // Initialize Transport and Accommodation state
  const [transport, setTransport] = useState<TransportDetails>({
    required: false,
    arrivalTime: null,
    returnTime: null,
    pickupLocation: '',
    dropLocation: '',
    arrivalMarked: false,
    arrivalMarkedAt: null,
    returnMarked: false,
    returnMarkedAt: null
  });

  const [accommodation, setAccommodation] = useState<AccommodationDetails>({
    required: false,
    name: '',
    checkIn: null,
    checkOut: null,
    status: 'booked'
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation || !organization) return;

    onSubmit({
      name,
      designation,
      organization,
      contact: contact || null,
      photo,
      subEventId: subEventId || null,
      transport,
      accommodation,
      attendance: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div className="space-y-2">
        <Label>Guest Photo</Label>
        <div className="flex items-center gap-4">
          {photo ? (
            <div className="relative">
              <img
                src={photo}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full"
                onClick={() => setPhoto(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="max-w-xs"
            />
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guestName">Guest Name *</Label>
          <Input
            id="guestName"
            placeholder="Enter guest name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Input
              id="designation"
              placeholder="e.g., Speaker, Attendee"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization *</Label>
            <Input
              id="organization"
              placeholder="Company or institution name"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number (Optional)</Label>
          <Input
            id="contact"
            type="tel"
            placeholder="+1 234 567 8900"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {subEvents.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="subEvent">Sub-Event (Optional)</Label>
            <select
              id="subEvent"
              value={subEventId}
              onChange={(e) => setSubEventId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select sub-event</option>
              {subEvents.map((se) => (
                <option key={se.id} value={se.id}>
                  {se.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Transport Module */}
      <div className="pt-4 border-t border-gray-200">
        <TransportSection transport={transport} onUpdate={setTransport} />
      </div>

      {/* Accommodation Module */}
      <div className="pt-4 border-t border-gray-200">
        <AccommodationSection accommodation={accommodation} onUpdate={setAccommodation} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
          Add Guest
        </Button>
      </div>
    </form>
  );
};