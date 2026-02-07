import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Upload, HardDrive, AlertCircle } from 'lucide-react';
import { downloadJSON, parseJSONFile } from '../../utils/storage';
import type { Event } from '../../types';

interface DataManagementProps {
  events: Event[];
  onImport: (events: Event[]) => void;
}

export const DataManagement = ({ events, onImport }: DataManagementProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadJSON(events, `guest-manager-backup-${timestamp}.json`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseJSONFile(file);
      // Basic validation to ensure it's an array of events
      if (Array.isArray(data)) {
        if (confirm('This will replace all current data. Are you sure?')) {
          onImport(data);
          alert('Data imported successfully!');
        }
      } else {
        alert('Invalid file format. Expected an array of events.');
      }
    } catch (error) {
      alert('Failed to read file. Please ensure it is a valid JSON file.');
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
        <p className="text-gray-500">Backup your data to your PC or restore from a file.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-indigo-600" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download all your events and guests as a JSON file to your computer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleExport} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={events.length === 0}
            >
              <HardDrive className="h-4 w-4 mr-2" />
              Download Backup
            </Button>
            {events.length === 0 && (
              <p className="text-xs text-gray-400 mt-2 text-center">No data to export</p>
            )}
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              Import Data
            </CardTitle>
            <CardDescription>
              Restore data from a previously saved JSON file. This will replace current data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <Button 
              onClick={handleImportClick} 
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File to Restore
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Warning Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800">Important Notice</h4>
              <p className="text-sm text-amber-700 mt-1">
                Importing data will completely overwrite your current events and guests. 
                We recommend exporting a backup before importing new data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};