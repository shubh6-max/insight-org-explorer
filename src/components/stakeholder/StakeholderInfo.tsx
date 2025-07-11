import React from 'react';
import { User, Building, Users, BarChart3, MessageSquare, Package, Briefcase, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { StakeholderData } from '@/pages/Stakeholder360';

interface StakeholderInfoProps {
  data: StakeholderData;
}

interface InfoSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  data: Record<string, any>;
}

const InfoTable: React.FC<{ title: string; icon: React.ReactNode; color: string; data: Record<string, any> }> = ({ 
  title, 
  icon, 
  color, 
  data 
}) => {
  const formatValue = (key: string, value: any) => {
    if (!value || value === '' || value === null || value === undefined) {
      return '-';
    }
    
    if (key.toLowerCase().includes('linkedin') && typeof value === 'string' && value.includes('linkedin.com')) {
      const username = value.split('/').pop() || value;
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          linkedin/{username}
        </a>
      );
    }
    
    return String(value);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm font-semibold flex items-center gap-2 p-2 rounded text-white`} style={{ backgroundColor: color }}>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(data).map(([key, value], index) => (
                <tr key={key} className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}>
                  <td className="p-3 font-medium text-muted-foreground border-r bg-muted/30 w-2/5">
                    {key}
                  </td>
                  <td className="p-3">
                    {formatValue(key, value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export const StakeholderInfo: React.FC<StakeholderInfoProps> = ({ data }) => {
  const profileImageUrl = "https://media.licdn.com/dms/image/v2/D5603AQEv1jiYkzrnmw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1662226370517?e=2147483647&v=beta&t=vQpJmgo1FZ-JXBv-9c8gXsLTbkto3B0QEJFnh44QZM0";

  const leftColumnSections: InfoSection[] = [
    {
      title: "👤 Lead Identification & Contact Details",
      icon: <User className="h-4 w-4" />,
      color: "#3b82f6",
      data: {
        "Business Group": data["Business Group"],
        "Lead Priority": data["Lead Priority"],
        "Client Name": data["Client Name"],
        "Designation": data["Designation"],
        "Location (from teams)": data["Location (from teams)"],
        "Email address": data["Email address"],
        "LinkedIn URL": data["LinkedIn URL"]
      }
    },
    {
      title: "📬 Engagement & Outreach Strategy",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "#10b981",
      data: {
        "Scope of work/Priorities (internal research)": data["Scope of work/Priorities (internal research)"],
        "Additional Research (External)": data["Additional Research (External)"],
        "MathCo LinkedIn Connects": data["MathCo LinkedIn Connects"],
        "Introduction Path": data["Introduction Path"],
        "Pursured in past": data["Pursured in past"],
        "Relationship Strength": data["Relationship Strength"],
        "Lead Potential ESS": data["Lead Potential ESS (func. Of designation & Vendor Count)"],
        "Lead Potential DAC": data["Lead Potential DAC (func. Of designation & Vendor Count)"],
        "If Yes, background/context ?": data["If Yes, background/context ?"],
        "Comments": data["Comments"]
      }
    }
  ];

  const rightColumnSections: InfoSection[] = [
    {
      title: "🏢 Company & Department Info",
      icon: <Building className="h-4 w-4" />,
      color: "#8b5cf6",
      data: {
        "Business Segment": data["Business Segment"],
        "Working Group": data["Working Group"],
        "Business Functions": data["Business Functions"]
      }
    },
    {
      title: "🧑‍🤝‍🧑 Organizational Hierarchy",
      icon: <Users className="h-4 w-4" />,
      color: "#f59e0b",
      data: {
        "1st Degree Manager": data["1st degree Manager"],
        "2nd Degree Manager": data["2nd Degree Manager"]
      }
    },
    {
      title: "📊 Lead Status & Tracking",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "#ef4444",
      data: {
        "Who will reach out ?": data["Who will reach out ?"],
        "Lever for Reach out(s) ready (Cold email/LinkedIn Message/Demos/PoVs etc.) ?": data["Lever for Reach out(s) ready (Cold email/LinkedIn Message/Demos/PoVs etc.) ?"],
        "Lead Status": data["Lead Status"]
      }
    },
    {
      title: "🧠 Expertise & Experience",
      icon: <Briefcase className="h-4 w-4" />,
      color: "#06b6d4",
      data: {
        "Designation Seniority": data["Designation Seniority"],
        "Location (From LinkedIn)": data["Location (from LinkedIn)"]
      }
    },
    {
      title: "📦 Contractor Information",
      icon: <Package className="h-4 w-4" />,
      color: "#84cc16",
      data: {
        "Contractor count": data["Contractor Count"],
        "Vendor Company Name": data["Vendor CompanyName"]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Image */}
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={profileImageUrl} alt="LinkedIn Profile" />
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">LinkedIn Profile Picture</p>
            </CardContent>
          </Card>

          {/* Left Column Sections */}
          {leftColumnSections.map((section, index) => (
            <InfoTable
              key={index}
              title={section.title}
              icon={section.icon}
              color={section.color}
              data={section.data}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightColumnSections.map((section, index) => (
            <InfoTable
              key={index}
              title={section.title}
              icon={section.icon}
              color={section.color}
              data={section.data}
            />
          ))}
        </div>
      </div>
    </div>
  );
};