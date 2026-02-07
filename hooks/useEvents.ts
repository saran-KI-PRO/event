import { useState, useEffect } from 'react';
import type { Event, Guest, SubEvent } from '../types';

const STORAGE_KEY = 'guest_manager_events';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse events', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever events change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events, isLoading]);

  const addEvent = (data: { name: string; date: string; category: Event['category'] }) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      name: data.name,
      date: data.date,
      category: data.category,
      subEvents: [],
      guests: [],
      budget: 0
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const updateBudget = (id: string, budget: number) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, budget } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addSubEvent = (eventId: string, data: { name: string; date: string }) => {
    const newSubEvent: SubEvent = {
      id: crypto.randomUUID(),
      name: data.name,
      date: data.date
    };
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, subEvents: [...e.subEvents, newSubEvent] } : e
    ));
  };

  const deleteSubEvent = (eventId: string, subEventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, subEvents: e.subEvents.filter(se => se.id !== subEventId) } 
        : e
    ));
  };

  const addGuest = (eventId: string, data: Omit<Guest, 'id' | 'eventId' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...data,
      id: crypto.randomUUID(),
      eventId,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, guests: [...e.guests, newGuest] } : e
    ));
  };

  const updateGuest = (eventId: string, guestId: string, updates: Partial<Guest>) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, guests: e.guests.map(g => g.id === guestId ? { ...g, ...updates } : g) } 
        : e
    ));
  };

  const deleteGuest = (eventId: string, guestId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, guests: e.guests.filter(g => g.id !== guestId) } 
        : e
    ));
  };

  // New: Import events from file (PC Storage)
  const importEvents = (importedEvents: Event[]) => {
    setEvents(importedEvents);
  };

  const getEventById = (id: string) => events.find(e => e.id === id);

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    updateBudget,
    deleteEvent,
    addSubEvent,
    deleteSubEvent,
    addGuest,
    updateGuest,
    deleteGuest,
    importEvents, // Added import function
    getEventById
  };
};