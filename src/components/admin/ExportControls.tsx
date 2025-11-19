import { useState } from 'react';
import { Download, Trash2, RefreshCw, FileJson, FileText, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportLocations, clearAllLocations, getLocations } from '@/utils/storage';
import { exportToCSV } from '@/utils/csvExport';
import { exportToPDF } from '@/utils/pdfExport';
import { toast } from 'sonner';

const ExportControls = () => {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExportJSON = () => {
    try {
      exportLocations();
      toast.success('JSON data exported successfully!');
    } catch (error) {
      toast.error('Failed to export JSON');
    }
  };

  const handleExportCSV = async () => {
    try {
      const locations = await getLocations();
      exportToCSV(locations);
      toast.success('CSV data exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const locations = await getLocations();
      exportToPDF(locations);
      toast.success('PDF report exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleClear = async () => {
    try {
      await clearAllLocations();
      setShowClearDialog(false);
      toast.success('All data cleared successfully!');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to clear data');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
    toast.success('Data refreshed!');
  };

  return (
    <>
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileJson className="w-4 h-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileImage className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setShowClearDialog(true)}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </Button>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all location data
              from local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExportControls;
