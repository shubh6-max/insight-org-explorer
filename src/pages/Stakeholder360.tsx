import React, { useState, useCallback } from 'react';
import { Upload, Users, Filter, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/stakeholder/FileUpload';
import { OrgChart } from '@/components/stakeholder/OrgChart';
import { StakeholderInfo } from '@/components/stakeholder/StakeholderInfo';
import { useToast } from '@/hooks/use-toast';

export interface StakeholderData {
  'Client Name': string;
  'Designation': string;
  'Business Group': string;
  'Working Group': string;
  'Business Functions': string;
  '1st degree Manager': string;
  '2nd Degree Manager': string;
  'Email address': string;
  'LinkedIn URL': string;
  'Location (from teams)': string;
  'Location (from LinkedIn)': string;
  'Lead Priority': string;
  'Business Segment': string;
  'Designation Seniority': string;
  'Contractor Count': number;
  'Vendor CompanyName': string;
  'Scope of work/Priorities (internal research)': string;
  'Additional Research (External)': string;
  'MathCo LinkedIn Connects': string;
  'Introduction Path': string;
  'Pursured in past': string;
  'Relationship Strength': string;
  'Lead Potential ESS (func. Of designation & Vendor Count)': string;
  'Lead Potential DAC (func. Of designation & Vendor Count)': string;
  'If Yes, background/context ?': string;
  'Comments': string;
  'Who will reach out ?': string;
  'Lever for Reach out(s) ready (Cold email/LinkedIn Message/Demos/PoVs etc.) ?': string;
  'Lead Status': string;
}

const Stakeholder360 = () => {
  const [data, setData] = useState<StakeholderData[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedWorkingGroup, setSelectedWorkingGroup] = useState<string>('All');
  const [selectedBusinessFunction, setSelectedBusinessFunction] = useState<string>('All');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('');
  const { toast } = useToast();

  const handleFileUploaded = useCallback((sheets: string[], initialData: StakeholderData[]) => {
    setSheetNames(sheets);
    if (sheets.length === 1) {
      setSelectedSheet(sheets[0]);
      setData(initialData);
    }
  }, []);

  const handleSheetSelected = useCallback((sheetData: StakeholderData[]) => {
    setData(sheetData);
    // Reset filters when sheet changes
    setSelectedWorkingGroup('All');
    setSelectedBusinessFunction('All');
    setSelectedStakeholder('');
  }, []);

  // Filter data based on selections
  const filteredData = React.useMemo(() => {
    let filtered = data.filter(row => row['Client Name']);
    
    if (selectedWorkingGroup !== 'All') {
      filtered = filtered.filter(row => row['Working Group'] === selectedWorkingGroup);
    }
    
    if (selectedBusinessFunction !== 'All') {
      filtered = filtered.filter(row => row['Business Functions'] === selectedBusinessFunction);
    }
    
    return filtered;
  }, [data, selectedWorkingGroup, selectedBusinessFunction]);

  // Get unique values for dropdowns
  const workingGroups = React.useMemo(() => {
    const groups = [...new Set(data.map(row => row['Working Group']).filter(Boolean))];
    return groups.sort();
  }, [data]);

  const businessFunctions = React.useMemo(() => {
    const functions = [...new Set(data.map(row => row['Business Functions']).filter(Boolean))];
    return functions.sort();
  }, [data]);

  const clientNames = React.useMemo(() => {
    const names = [...new Set(filteredData.map(row => row['Client Name']).filter(Boolean))];
    return names.sort();
  }, [filteredData]);

  const selectedStakeholderData = React.useMemo(() => {
    return filteredData.find(row => row['Client Name'] === selectedStakeholder);
  }, [filteredData, selectedStakeholder]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/88/MathCo_Logo.png" 
              alt="MathCo Logo"
              className="h-12 bg-white p-2 rounded border shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Stakeholder 360</h1>
              <p className="text-muted-foreground">Organizational viewer and stakeholder management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload 
              onFileUploaded={handleFileUploaded}
              sheetNames={sheetNames}
              selectedSheet={selectedSheet}
              onSheetChange={setSelectedSheet}
              onSheetSelected={handleSheetSelected}
            />
          </CardContent>
        </Card>

        {data.length > 0 && selectedSheet && (
          <>
            {/* Filters Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Working Group</label>
                    <Select value={selectedWorkingGroup} onValueChange={setSelectedWorkingGroup}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {workingGroups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Functions</label>
                    <Select value={selectedBusinessFunction} onValueChange={setSelectedBusinessFunction}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {businessFunctions.map(func => (
                          <SelectItem key={func} value={func}>{func}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Stakeholder</label>
                    <Select value={selectedStakeholder} onValueChange={setSelectedStakeholder}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose stakeholder..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clientNames.map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Results</label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {filteredData.length} stakeholder{filteredData.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </div>

                {filteredData.length === 0 && (
                  <Alert className="mt-4">
                    <AlertDescription>
                      No stakeholders match the selected filters. Please adjust your criteria.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Stakeholder Details */}
            {selectedStakeholderData && (
              <>
                {/* Org Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Org Chart for {selectedStakeholder}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OrgChart 
                      stakeholderData={selectedStakeholderData}
                      allData={data}
                    />
                  </CardContent>
                </Card>

                {/* Stakeholder Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      Stakeholder Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StakeholderInfo data={selectedStakeholderData} />
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stakeholder360;