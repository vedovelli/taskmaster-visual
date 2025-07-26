import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  ArrowLeft, 
  Settings, 
  Download,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { TaskGrid } from './TaskGrid';
import { mockTasks } from '@/data/mockTasks';
import { cn } from '@/lib/utils';

interface TaskMasterLayoutProps {
  onBack: () => void;
}

export const TaskMasterLayout = ({ onBack }: TaskMasterLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Laravel Project Setup
                </h1>
                <p className="text-xs text-muted-foreground">
                  Task Master Project
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed md:sticky top-16 left-0 z-50 w-80 h-[calc(100vh-4rem)] bg-card border-r border-border transform transition-transform duration-300 md:transform-none overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="p-6 space-y-6">
            {/* Project Info */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Project Overview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tasks:</span>
                  <span className="font-medium text-foreground">{mockTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium text-status-done">
                    {mockTasks.filter(t => t.status === 'done').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In Progress:</span>
                  <span className="font-medium text-status-in-progress">
                    {mockTasks.filter(t => t.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blocked:</span>
                  <span className="font-medium text-status-blocked">
                    {mockTasks.filter(t => t.status === 'blocked').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {Math.round((mockTasks.filter(t => t.status === 'done').length / mockTasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ 
                    width: `${(mockTasks.filter(t => t.status === 'done').length / mockTasks.length) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4" />
                  Reload Project
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-status-done rounded-full mt-2" />
                  <div>
                    <p className="text-foreground">Task #1 completed</p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-status-in-progress rounded-full mt-2" />
                  <div>
                    <p className="text-foreground">Task #2 in progress</p>
                    <p className="text-muted-foreground text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-status-blocked rounded-full mt-2" />
                  <div>
                    <p className="text-foreground">Task #4 blocked</p>
                    <p className="text-muted-foreground text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 max-w-none overflow-x-auto">
          <TaskGrid tasks={mockTasks} />
        </main>
      </div>
    </div>
  );
};