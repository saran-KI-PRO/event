export type EventCategory = 'Workshop' | 'Panel' | 'Summit' | 'Cultural' | 'Other';

export interface SubEvent {
  id: string;
  name: string;
  dateTime: string;
}

export interface TransportDetails {
  required: boolean;
  arrival: string | null;
  return: string | null;
  pickup: string;
  drop: string;
  arrivalMarked: boolean;
  returnMarked: boolean;
}

export interface AccommodationDetails {
  required: boolean;
  name: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'booked' | 'checked-in' | 'checked-out';
}

export interface Guest {
  id: string;
  eventId: string;
  subEventId?: string;
  name: string;
  designation: string;
  organization: string;
  photo?: string;
  contact?: string;
  transport: TransportDetails;
  accommodation: AccommodationDetails;
  attendance: boolean;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  category: EventCategory;
  duration: number; // NEW: Number of days
  subEvents: SubEvent[];
  guests: Guest[];
}