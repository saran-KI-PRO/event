import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox'; // Ensure Checkbox is imported
import { Truck, Clock, MapPin, Check, X } from 'lucide-react';
import type { TransportDetails } from '../../types';

interface TransportSectionProps {
  transport: TransportDetails;
  onUpdate: (transport: TransportDetails) => void;
  readonly?: boolean;
}

export const TransportSection = ({ transport, onUpdate, readonly = false }: TransportSectionProps) => {
  const [showDetails, setShowDetails] = useState(transport.required);

  const handleToggleRequired = (checked: boolean) => {
    setShowDetails(checked);
    onUpdate({
      ...transport,
      required: checked,
      arrivalTime: checked ? transport.arrivalTime : null,
      returnTime: checked ? transport.returnTime : null,
      pickupLocation: checked ? transport.pickupLocation : '',
      dropLocation: checked ? transport.dropLocation : ''
    });
  };

  const handleMarkArrival = () => {
    onUpdate({
      ...transport,
      arrivalMarked: !transport.arrivalMarked,
      arrivalMarkedAt: !transport.arrivalMarked ? new Date().toISOString() : null
    });
  };

  const handleMarkReturn = () => {
    onUpdate({
      ...transport,
      returnMarked: !transport.returnMarked,
      returnMarkedAt: !transport.returnMarked ? new Date().toISOString() : null
    });
  };

  if (readonly) {
    if (!transport.required) return null;

    return (
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Truck className="h-4 w-4" />
          Transportation
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Arrival</p>
            <p className="font-medium">
              {transport.arrivalTime ? new Date(transport.arrivalTime).toLocaleString() : 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Return</p>
            <p className="font-medium">
              {transport.returnTime ? new Date(transport.returnTime).toLocaleString() : 'Not set'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Pickup</p>
            <p className="font-medium">{transport.pickupLocation || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-500">Drop</p>
            <p className="font-medium">{transport.dropLocation || 'Not set'}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant={transport.arrivalMarked ? "default" : "outline"}
            size="sm"
            onClick={handleMarkArrival}
            className={transport.arrivalMarked ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {transport.arrivalMarked ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
            Arrival
          </Button>
          <Button
            variant={transport.returnMarked ? "default" : "outline"}
            size="sm"
            onClick={handleMarkReturn}
            className={transport.returnMarked ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {transport.returnMarked ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
            Return
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id="transportRequired"
          checked={transport.required}
          onCheckedChange={handleToggleRequired}
        />
        <Label htmlFor="transportRequired" className="font-medium cursor-pointer">
          Transportation Required
        </Label>
      </div>

      {showDetails && (
        <div className="space-y-4 pl-7 border-l-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">
                <Clock className="h-4 w-4 inline mr-1" />
                Arrival Time
              </Label>
              <Input
                id="arrivalTime"
                type="datetime-local"
                value={transport.arrivalTime || ''}
                onChange={(e) => onUpdate({ ...transport, arrivalTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnTime">
                <Clock className="h-4 w-4 inline mr-1" />
                Return Time
              </Label>
              <Input
                id="returnTime"
                type="datetime-local"
                value={transport.returnTime || ''}
                onChange={(e) => onUpdate({ ...transport, returnTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">
                <MapPin className="h-4 w-4 inline mr-1" />
                Pickup Location
              </Label>
              <Input
                id="pickupLocation"
                placeholder="Enter pickup location"
                value={transport.pickupLocation}
                onChange={(e) => onUpdate({ ...transport, pickupLocation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropLocation">
                <MapPin className="h-4 w-4 inline mr-1" />
                Drop Location
              </Label>
              <Input
                id="dropLocation"
                placeholder="Enter drop location"
                value={transport.dropLocation}
                onChange={(e) => onUpdate({ ...transport, dropLocation: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};