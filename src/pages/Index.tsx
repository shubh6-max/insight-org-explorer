import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/88/MathCo_Logo.png" 
              alt="MathCo Logo"
              className="h-12 bg-white p-2 rounded border shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">MathCo Applications</h1>
              <p className="text-muted-foreground">Business intelligence and stakeholder management tools</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose an Application</h2>
            <p className="text-xl text-muted-foreground">Select from our suite of business tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stakeholder 360 Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/stakeholder360')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <span className="group-hover:text-primary transition-colors">Stakeholder 360</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive stakeholder management with organizational charts, contact details, and engagement tracking.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <span>Excel file upload support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Interactive org charts</span>
                  </div>
                </div>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  Launch Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Placeholder for future apps */}
            <Card className="opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span>Coming Soon</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Additional business intelligence tools and applications will be available here.
                </p>
                <Button disabled className="w-full">
                  Under Development
                </Button>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span>Coming Soon</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  More applications for data analysis and business intelligence coming soon.
                </p>
                <Button disabled className="w-full">
                  Under Development
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
