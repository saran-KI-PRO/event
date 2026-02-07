import { EventCard } from './EventCard';
import { Button } from '../ui/button';
import { Plus, Calendar, Users, Truck, Hotel } from 'lucide-react';
import type { Event } from '../../types';

interface DashboardProps {
  events: Event[];
  onAddEvent: () => void;
  onSelectEvent: (event: Event) => void;
}

export const Dashboard = ({ events, onAddEvent, onSelectEvent }: DashboardProps) => {
  const totalGuests = events.reduce((sum, e) => sum + e.guests.length, 0);
  const totalTransport = events.reduce((sum, e) => 
    sum + e.guests.filter(g => g.transport.required).length, 0
  );
  const totalAccommodation = events.reduce((sum, e) => 
    sum + e.guests.filter(g => g.accommodation.required).length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500">Overview of your events and guests</p>
        </div>
        <Button
          onClick={onAddEvent}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              <p className="text-sm text-gray-500">Events</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
              <p className="text-sm text-gray-500">Total Guests</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTransport}</p>
              <p className="text-sm text-gray-500">Transport</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Hotel className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalAccommodation}</p>
              <p className="text-sm text-gray-500">Accommodation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Events</h3>
        {events.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">No events created yet</p>
            <Button
              onClick={onAddEvent}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onSelectEvent(event)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};