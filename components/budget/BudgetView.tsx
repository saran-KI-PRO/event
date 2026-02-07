import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { DollarSign, Save, Calendar, TrendingUp } from 'lucide-react';
import type { Event } from '../../types';

interface BudgetViewProps {
  events: Event[];
  onUpdateBudget: (eventId: string, budget: number) => void;
}

export const BudgetView = ({ events, onUpdateBudget }: BudgetViewProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('0');

  const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0);

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setTempBudget(event.budget.toString());
  };

  const handleSave = (eventId: string) => {
    const budgetValue = parseFloat(tempBudget);
    if (!isNaN(budgetValue) && budgetValue >= 0) {
      onUpdateBudget(eventId, budgetValue);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempBudget('0');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
        <p className="text-gray-500">Track and update budgets for your events</p>
      </div>

      {/* Summary Card */}
      <Card className="bg-indigo-50 border-indigo-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 mb-1">Total Allocated Budget</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-indigo-900">
                  ${totalBudget.toLocaleString()}
                </span>
                <span className="text-sm text-indigo-600">USD</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Budget List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No events to manage budget for</p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Budget Input */}
                  <div className="flex items-center gap-3 min-w-[300px]">
                    {editingId === event.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={tempBudget}
                            onChange={(e) => setTempBudget(e.target.value)}
                            className="pl-8"
                            autoFocus
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSave(event.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1 text-lg font-medium text-gray-900">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          {(event.budget || 0).toLocaleString()}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          Update
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};