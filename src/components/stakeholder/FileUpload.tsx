import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import type { StakeholderData } from '@/pages/Stakeholder360';

interface FileUploadProps {
  onFileUploaded: (sheets: string[], data: StakeholderData[]) => void;
  sheetNames: string[];
  selectedSheet: string;
  onSheetChange: (sheet: string) => void;
  onSheetSelected: (data: StakeholderData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  sheetNames,
  selectedSheet,
  onSheetChange,
  onSheetSelected
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel (.xlsx) file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      setWorkbook(wb);
      
      const sheets = wb.SheetNames;
      
      // If only one sheet, automatically load it
      if (sheets.length === 1) {
        const ws = wb.Sheets[sheets[0]];
        const data = XLSX.utils.sheet_to_json(ws) as StakeholderData[];
        onFileUploaded(sheets, data);
      } else {
        onFileUploaded(sheets, []);
      }

      toast({
        title: "File uploaded successfully",
        description: `Found ${sheets.length} sheet${sheets.length > 1 ? 's' : ''} in the workbook.`
      });
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error reading file",
        description: "Please make sure the file is a valid Excel file.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [onFileUploaded, toast]);

  const handleSheetChange = useCallback((sheet: string) => {
    if (!workbook || sheet === "-- Select Sheet --") return;
    
    onSheetChange(sheet);
    
    try {
      const ws = workbook.Sheets[sheet];
      const data = XLSX.utils.sheet_to_json(ws) as StakeholderData[];
      onSheetSelected(data);
      
      toast({
        title: "Sheet loaded",
        description: `Loaded ${data.length} records from ${sheet}.`
      });
    } catch (error) {
      console.error('Error reading sheet:', error);
      toast({
        title: "Error reading sheet",
        description: "Could not read the selected sheet.",
        variant: "destructive"
      });
    }
  }, [workbook, onSheetChange, onSheetSelected, toast]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">📂 Upload Excel File</label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isLoading ? 'Processing file...' : 'Click to upload Excel file'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports .xlsx files only
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {sheetNames.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Sheet</label>
          <Select value={selectedSheet} onValueChange={handleSheetChange}>
            <SelectTrigger>
              <SelectValue placeholder="-- Select Sheet --" />
            </SelectTrigger>
            <SelectContent>
              {sheetNames.map(sheet => (
                <SelectItem key={sheet} value={sheet}>{sheet}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {sheetNames.length > 0 && !selectedSheet && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a sheet to continue.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};