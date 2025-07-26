import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Folder, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

interface ProjectLoaderProps {
  onLoadProject: () => void;
}

export const ProjectLoader = ({ onLoadProject }: ProjectLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectProject = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      // Trigger project load after success message
      setTimeout(() => {
        onLoadProject();
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <img 
              src={heroImage} 
              alt="Task Master Dashboard" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
                Task Master
              </h1>
              <p className="text-xl text-muted-foreground">
                Professional project management interface
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-8 md:p-12 text-center bg-card/50 backdrop-blur-sm border-border/50">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Folder className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Load Your Project
              </h2>
              <p className="text-muted-foreground text-lg">
                Select a Task Master project file to view your tasks, dependencies, and project structure in a beautiful, organized interface.
              </p>
            </div>

            {/* Action Section */}
            <div className="space-y-6">
              {!showSuccess ? (
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleSelectProject}
                  disabled={isLoading}
                  className="text-lg px-12 py-6 h-auto"
                >
                  {isLoading ? (
                    <>
                      <Upload className="animate-spin" />
                      Loading Project...
                    </>
                  ) : (
                    <>
                      <Folder />
                      Select Project File
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex items-center justify-center space-x-3 text-status-done">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg font-medium">Project loaded successfully!</span>
                </div>
              )}

              {/* Status Messages */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    Supports .taskmaster, .json, and .yaml project files
                  </span>
                </div>
                
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    <p>✓ Validating project structure...</p>
                    <p>✓ Loading task dependencies...</p>
                    <p>→ Preparing interface...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-status-done/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-status-done" />
                  </div>
                  <h3 className="font-medium text-foreground">Task Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Visual status indicators and progress tracking
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-foreground">Hierarchical View</h3>
                  <p className="text-sm text-muted-foreground">
                    Organized task structure with subtask nesting
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-foreground">Smart Dependencies</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic dependency mapping and visualization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};