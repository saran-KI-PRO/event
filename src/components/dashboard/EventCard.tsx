import { Event } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Users, Clock, Truck, Hotel } from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  // Calculate summaries
  const totalGuests = event.guests.length;
  const transportCount = event.guests.filter(g => g.transport.required).length;
  const accommodationCount = event.guests.filter(g => g.accommodation.required).length;

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:border-indigo-300 border-gray-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
            {event.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Date and Duration Row */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{event.duration} Day{event.duration > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span className="font-medium">{totalGuests}</span>
            <span className="text-xs text-gray-400">Guests</span>
          </div>
          
          {transportCount > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Truck className="w-4 h-4" />
              <span className="font-medium">{transportCount}</span>
              <span className="text-xs text-gray-400">Trans</span>
            </div>
          )}

          {accommodationCount > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Hotel className="w-4 h-4" />
              <span className="font-medium">{accommodationCount}</span>
              <span className="text-xs text-gray-400">Stay</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}