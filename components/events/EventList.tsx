import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Calendar, Users, Trash2, Edit, ChevronRight } from 'lucide-react';
import { EventForm } from './EventForm';
import { SubEventForm } from './SubEventForm';
import { GuestForm } from '../guests/GuestForm';
import { GuestList } from '../guests/GuestList';
import type { Event, SubEvent, Guest } from '../../types';

interface EventListProps {
  events: Event[];
  onAddEvent: (data: { name: string; date: string; category: Event['category'] }) => void;
  onUpdateEvent: (id: string, updates: Partial<Event>) => void;
  onDeleteEvent: (id: string) => void;
  onAddSubEvent: (eventId: string, data: { name: string; date: string }) => void;
  onDeleteSubEvent: (eventId: string, subEventId: string) => void;
  onAddGuest: (eventId: string, data: Omit<Guest, 'id' | 'eventId' | 'createdAt'>) => void;
  onUpdateGuest: (eventId: string, guestId: string, updates: Partial<Guest>) => void;
  onDeleteGuest: (eventId: string, guestId: string) => void;
}

export const EventList = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddSubEvent,
  onDeleteSubEvent,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest
}: EventListProps) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showSubEventForm, setShowSubEventForm] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleAddGuest = (guestData: Omit<Guest, 'id' | 'eventId' | 'createdAt'>) => {
    if (selectedEvent) {
      onAddGuest(selectedEvent.id, guestData);
      setShowGuestForm(false);
    }
  };

  const handleUpdateGuest = (guestId: string, updates: Partial<Guest>) => {
    if (selectedEvent) {
      onUpdateGuest(selectedEvent.id, guestId, updates);
    }
  };

  const handleDeleteGuest = (guestId: string) => {
    if (selectedEvent) {
      onDeleteGuest(selectedEvent.id, guestId);
    }
  };

  const handleEditGuest = (guest: Guest) => {
    // For MVP, we'll just show an alert. In a full app, this would open an edit form
    alert('Edit functionality would open a pre-filled form here');
  };

  if (selectedEvent) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setSelectedEvent(null)}
          className="gap-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to Events
        </Button>

        {/* Event Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedEvent.name}</CardTitle>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </span>
                  <Badge>{selectedEvent.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedEvent.guests.length} guests
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingEvent(selectedEvent);
                    setShowEventForm(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    if (confirm('Delete this event and all its data?')) {
                      onDeleteEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Sub-Events Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sub-Events</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowSubEventForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Sub-Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedEvent.subEvents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No sub-events yet</p>
            ) : (
              <div className="space-y-2">
                {selectedEvent.subEvents.map((subEvent) => (
                  <div
                    key={subEvent.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{subEvent.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(subEvent.date).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (confirm('Delete this sub-event?')) {
                          onDeleteSubEvent(selectedEvent.id, subEvent.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guests Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Guests</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowGuestForm(true)}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Guest
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <GuestList
              guests={selectedEvent.guests}
              subEvents={selectedEvent.subEvents}
              eventCategory={selectedEvent.category}
              onUpdateGuest={handleUpdateGuest}
              onDeleteGuest={handleDeleteGuest}
              onEditGuest={handleEditGuest}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        {showSubEventForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Sub-Event</CardTitle>
              </CardHeader>
              <CardContent>
                <SubEventForm
                  onSubmit={(data) => {
                    onAddSubEvent(selectedEvent.id, data);
                    setShowSubEventForm(false);
                  }}
                  onCancel={() => setShowSubEventForm(false)}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {showGuestForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardHeader>
                <CardTitle>Add Guest</CardTitle>
              </CardHeader>
              <CardContent>
                <GuestForm
                  onSubmit={handleAddGuest}
                  onCancel={() => setShowGuestForm(false)}
                  subEvents={selectedEvent.subEvents}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Events</h2>
        <Button
          onClick={() => {
            setEditingEvent(null);
            setShowEventForm(true);
          }}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500 mb-4">Create your first event to get started</p>
            <Button
              onClick={() => setShowEventForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
              onClick={() => setSelectedEvent(event)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">{event.name}</CardTitle>
                  <Badge>{event.category}</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.guests.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.subEvents.length} sub-events
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showEventForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm
                initialData={editingEvent ? {
                  name: editingEvent.name,
                  date: editingEvent.date,
                  category: editingEvent.category
                } : undefined}
                onSubmit={(data) => {
                  if (editingEvent) {
                    onUpdateEvent(editingEvent.id, data);
                  } else {
                    onAddEvent(data);
                  }
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
                onCancel={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};