import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Event, EventCategory } from "../../types";

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Omit<Event, "id" | "subEvents" | "guests">) => void;
  onCancel: () => void;
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [duration, setDuration] = useState(initialData?.duration || 1);
  const [category, setCategory] = useState<EventCategory>(
    initialData?.category || "Other"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    onSubmit({
      name,
      date,
      duration,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          placeholder="e.g. Annual Green Summit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Start Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* NEW: Duration Field */}
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (Days)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            placeholder="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value: EventCategory) => setCategory(value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Panel">Panel</SelectItem>
            <SelectItem value="Summit">Summit</SelectItem>
            <SelectItem value="Cultural">Cultural</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
          {initialData ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}