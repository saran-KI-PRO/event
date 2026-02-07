import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useEvents } from './hooks/useEvents';
import { Login } from './components/auth/Login';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { EventList } from './components/events/EventList';
import { GuestList } from './components/guests/GuestList';
import { BudgetView } from './components/budget/BudgetView';
import { DataManagement } from './components/settings/DataManagement';
import { Card, CardContent } from './components/ui/card';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import type { Event } from './types';

declare module 'react/jsx-runtime' {
  export * from 'react';
  export { JSX } from 'react';
}

type View = 'dashboard' | 'events' | 'guestBook' | 'budget' | 'settings';

function App() {
  const { authState, login, logout, isLoading: authLoading } = useAuth();
  const { events, addEvent, updateEvent, updateBudget, deleteEvent, addSubEvent, deleteSubEvent, addGuest, updateGuest, deleteGuest, importEvents, getEventById } = useEvents();
  
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Login onLogin={login} />;
  }

  const handleViewChange = (view: View) => {
    setActiveView(view);
    if (view !== 'guestBook') {
      setSelectedEventId(null);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEventId(event.id);
    if (activeView === 'dashboard') {
      setActiveView('events');
    }
  };

  const handleAddEvent = (data: { name: string; date: string; category: Event['category'] }) => {
    addEvent(data);
  };

  const selectedEvent = selectedEventId ? getEventById(selectedEventId) : null;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            events={events}
            onAddEvent={() => setActiveView('events')}
            onSelectEvent={handleSelectEvent}
          />
        );
      
      case 'events':
        return (
          <EventList
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            onAddSubEvent={addSubEvent}
            onDeleteSubEvent={deleteSubEvent}
            onAddGuest={addGuest}
            onUpdateGuest={updateGuest}
            onDeleteGuest={deleteGuest}
          />
        );
      
      case 'guestBook':
        if (!selectedEvent) {
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Book</h2>
                <p className="text-gray-500">Select an event to view and manage guests</p>
              </div>
              
              {events.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No events available</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{event.name}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          {event.guests.length} guests
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedEventId(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to Events
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                <p className="text-gray-500">Guest Management</p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <GuestList
                  guests={selectedEvent.guests}
                  subEvents={selectedEvent.subEvents}
                  eventCategory={selectedEvent.category}
                  onUpdateGuest={(guestId, updates) => updateGuest(selectedEvent.id, guestId, updates)}
                  onDeleteGuest={(guestId) => deleteGuest(selectedEvent.id, guestId)}
                  onEditGuest={(guest) => alert('Edit functionality: ' + guest.name)}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'budget':
        return (
          <BudgetView
            events={events}
            onUpdateBudget={updateBudget}
          />
        );

      case 'settings':
        return (
          <DataManagement
            events={events}
            onImport={importEvents}
          />
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'events':
        return 'Events Management';
      case 'guestBook':
        return selectedEvent ? selectedEvent.name : 'Guest Book';
      case 'budget':
        return 'Budget Management';
      case 'settings':
        return 'Data & Settings';
      default:
        return 'Guest Manager';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={logout}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header title={getTitle()} onMenuClick={() => setIsMobileOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

npm.cmd set registry https://registry.npmjs.org/
npm.cmd login
npm.cmd whoami
type %USERPROFILE%\.npmrc