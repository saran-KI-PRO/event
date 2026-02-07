import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Filter, Truck, Hotel, Check, User, Edit, Trash2 } from 'lucide-react';
import { TransportSection } from '../modules/TransportSection';
import { AccommodationSection } from '../modules/AccommodationSection';
import type { Guest, SubEvent, EventCategory } from '../../types';

interface GuestListProps {
  guests: Guest[];
  subEvents: SubEvent[];
  eventCategory: EventCategory;
  onUpdateGuest: (guestId: string, updates: Partial<Guest>) => void;
  onDeleteGuest: (guestId: string) => void;
  onEditGuest: (guest: Guest) => void;
}

export const GuestList = ({ guests, subEvents, eventCategory, onUpdateGuest, onDeleteGuest, onEditGuest }: GuestListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubEvent, setFilterSubEvent] = useState<string>('all');
  const [filterTransport, setFilterTransport] = useState<string>('all');
  const [filterAccommodation, setFilterAccommodation] = useState<string>('all');
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null);

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubEvent = filterSubEvent === 'all' || guest.subEventId === filterSubEvent;
    const matchesTransport = filterTransport === 'all' || 
      (filterTransport === 'required' ? guest.transport.required : !guest.transport.required);
    const matchesAccommodation = filterAccommodation === 'all' || 
      (filterAccommodation === 'required' ? guest.accommodation.required : !guest.accommodation.required);

    return matchesSearch && matchesSubEvent && matchesTransport && matchesAccommodation;
  });

  const toggleAttendance = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      onUpdateGuest(guestId, { attendance: !guest.attendance });
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Designation', 'Organization', 'Contact', 'Sub-Event', 'Transport', 'Accommodation', 'Attendance'];
    const rows = filteredGuests.map(g => [
      g.name,
      g.designation,
      g.organization,
      g.contact || '',
      subEvents.find(se => se.id === g.subEventId)?.name || 'Main Event',
      g.transport.required ? 'Yes' : 'No',
      g.accommodation.required ? 'Yes' : 'No',
      g.attendance ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guests.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search guests by name, designation, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterSubEvent}
            onChange={(e) => setFilterSubEvent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Sub-Events</option>
            {subEvents.map(se => (
              <option key={se.id} value={se.id}>{se.name}</option>
            ))}
          </select>

          <select
            value={filterTransport}
            onChange={(e) => setFilterTransport(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Transport: All</option>
            <option value="required">Transport: Required</option>
            <option value="not-required">Transport: Not Required</option>
          </select>

          <select
            value={filterAccommodation}
            onChange={(e) => setFilterAccommodation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Accommodation: All</option>
            <option value="required">Accommodation: Required</option>
            <option value="not-required">Accommodation: Not Required</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="ml-auto"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Guest List */}
      <div className="space-y-3">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No guests found</p>
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <Card key={guest.id} className="border-gray-200 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  {guest.photo ? (
                    <img
                      src={guest.photo}
                      alt={guest.name}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <User className="h-7 w-7 text-indigo-600" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                        <p className="text-sm text-gray-600">{guest.designation}</p>
                        <p className="text-sm text-gray-500">{guest.organization}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEditGuest(guest)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteGuest(guest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-3 mt-3">
                      <Button
                        variant={guest.attendance ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleAttendance(guest.id)}
                        className={guest.attendance ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {guest.attendance ? 'Present' : 'Absent'}
                      </Button>

                      {guest.transport.required && (
                        <Badge variant="outline" className="gap-1">
                          <Truck className="h-3 w-3" />
                          {guest.transport.arrivalMarked && guest.transport.returnMarked ? '✅' : '○'}
                        </Badge>
                      )}

                      {guest.accommodation.required && (
                        <Badge 
                          variant="outline" 
                          className={`gap-1 ${
                            guest.accommodation.status === 'checked-in' ? 'bg-green-50 text-green-700 border-green-200' :
                            guest.accommodation.status === 'checked-out' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            ''
                          }`}
                        >
                          <Hotel className="h-3 w-3" />
                          {guest.accommodation.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                {expandedGuest === guest.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <TransportSection
                      transport={guest.transport}
                      readonly
                      onUpdate={(transport) => onUpdateGuest(guest.id, { transport })}
                    />
                    <AccommodationSection
                      accommodation={guest.accommodation}
                      readonly
                      onUpdate={(accommodation) => onUpdateGuest(guest.id, { accommodation })}
                    />
                  </div>
                )}

                {/* Expand Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => setExpandedGuest(expandedGuest === guest.id ? null : guest.id)}
                >
                  {expandedGuest === guest.id ? 'Hide Details' : 'View Details'}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};