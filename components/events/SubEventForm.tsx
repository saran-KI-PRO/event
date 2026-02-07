import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SubEventFormProps {
  onSubmit: (data: { name: string; date: string }) => void;
  onCancel: () => void;
}

export const SubEventForm = ({ onSubmit, onCancel }: SubEventFormProps) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;
    onSubmit({ name, date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subEventName">Sub-Event Name *</Label>
        <Input
          id="subEventName"
          placeholder="Enter sub-event name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subEventDate">Date & Time *</Label>
        <Input
          id="subEventDate"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
          Add Sub-Event
        </Button>
      </div>
    </form>
  );
};