import React, { useMemo } from 'react';
import { User, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StakeholderData } from '@/pages/Stakeholder360';

interface OrgChartProps {
  stakeholderData: StakeholderData;
  allData: StakeholderData[];
}

interface PersonNode {
  name: string;
  title: string;
  level: number;
  isSelected: boolean;
  color: 'gray' | 'blue' | 'green' | 'yellow';
}

export const OrgChart: React.FC<OrgChartProps> = ({ stakeholderData, allData }) => {
  const chartData = useMemo(() => {
    const nodes: PersonNode[] = [];
    const client = stakeholderData['Client Name'];
    const mgr1 = stakeholderData['1st degree Manager'];
    const mgr2 = stakeholderData['2nd Degree Manager'];

    // Add 2nd degree manager
    if (mgr2) {
      const mgr2Data = allData.find(row => row['Client Name'] === mgr2);
      nodes.push({
        name: mgr2,
        title: mgr2Data?.['Designation'] || 'Manager',
        level: 0,
        isSelected: false,
        color: 'gray'
      });
    }

    // Add 1st degree manager
    if (mgr1) {
      const mgr1Data = allData.find(row => row['Client Name'] === mgr1);
      nodes.push({
        name: mgr1,
        title: mgr1Data?.['Designation'] || 'Manager',
        level: mgr2 ? 1 : 0,
        isSelected: false,
        color: 'blue'
      });
    }

    // Add selected stakeholder
    nodes.push({
      name: client,
      title: stakeholderData['Designation'],
      level: (mgr2 ? 1 : 0) + (mgr1 ? 1 : 0),
      isSelected: true,
      color: 'green'
    });

    // Add reportees
    const reportees = allData.filter(row => row['1st degree Manager'] === client);
    reportees.forEach(reportee => {
      nodes.push({
        name: reportee['Client Name'],
        title: reportee['Designation'],
        level: (mgr2 ? 1 : 0) + (mgr1 ? 1 : 0) + 1,
        isSelected: false,
        color: 'yellow'
      });
    });

    return nodes;
  }, [stakeholderData, allData]);

  const getNodeColor = (color: PersonNode['color'], isSelected: boolean) => {
    if (isSelected) return 'bg-green-100 border-green-500 text-green-800';
    
    switch (color) {
      case 'gray': return 'bg-gray-100 border-gray-400 text-gray-800';
      case 'blue': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'yellow': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const groupedByLevel = useMemo(() => {
    return chartData.reduce((acc, node) => {
      if (!acc[node.level]) acc[node.level] = [];
      acc[node.level].push(node);
      return acc;
    }, {} as Record<number, PersonNode[]>);
  }, [chartData]);

  const maxLevel = Math.max(...Object.keys(groupedByLevel).map(Number));

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-8 p-6 bg-card rounded-lg">
        {Object.keys(groupedByLevel)
          .map(Number)
          .sort()
          .map(level => (
            <div key={level} className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center space-x-6">
                {groupedByLevel[level].map((node, index) => (
                  <div key={`${level}-${index}`} className="flex flex-col items-center">
                    <Card className={`p-4 min-w-[200px] text-center border-2 transition-all hover:shadow-lg ${getNodeColor(node.color, node.isSelected)}`}>
                      <div className="flex items-center justify-center mb-2">
                        <User className="h-5 w-5 mr-2" />
                        {node.isSelected && <Badge variant="secondary" className="text-xs">Selected</Badge>}
                      </div>
                      <div className="font-semibold text-sm">{node.name}</div>
                      <div className="text-xs opacity-75 mt-1">{node.title}</div>
                    </Card>
                  </div>
                ))}
              </div>
              
              {/* Connection lines */}
              {level < maxLevel && (
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-border"></div>
                  <div className="w-px h-4 bg-border"></div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Chart Legend
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-400 rounded"></div>
            <span>2nd Degree Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
            <span>1st Degree Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
            <span>Selected Stakeholder</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 rounded"></div>
            <span>Direct Reports</span>
          </div>
        </div>
      </div>
    </div>
  );
};