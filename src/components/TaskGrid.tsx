import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Task } from '@/data/mockTasks';

interface TaskGridProps {
  tasks: Task[];
}

export const TaskGrid = ({ tasks }: TaskGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Calculate task statistics
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    blocked: tasks.filter(t => t.status === 'blocked').length
  };

  const statusFilters = [
    { key: 'all', label: 'All Tasks', count: stats.total, color: 'text-foreground' },
    { key: 'done', label: 'Done', count: stats.done, color: 'text-status-done', icon: CheckCircle },
    { key: 'in-progress', label: 'In Progress', count: stats.inProgress, color: 'text-status-in-progress', icon: Clock },
    { key: 'pending', label: 'Pending', count: stats.pending, color: 'text-status-pending', icon: Clock },
    { key: 'blocked', label: 'Blocked', count: stats.blocked, color: 'text-status-blocked', icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Project Tasks</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {stats.total} total tasks
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round((stats.done / stats.total) * 100)}% complete
            </div>
          </div>
        </div>
        
        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusFilters.slice(1).map((filter) => {
          const Icon = filter.icon!;
          return (
            <Card key={filter.key} className="p-4 hover:bg-card/80 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${filter.color.replace('text-', 'bg-')}/10`}>
                  <Icon className={`w-4 h-4 ${filter.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{filter.count}</div>
                  <div className="text-sm text-muted-foreground">{filter.label}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={selectedStatus === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(filter.key)}
              className="text-xs"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
        
        <Button variant="outline" size="sm">
          <SortAsc className="w-4 h-4" />
          Sort
        </Button>
      </div>

      {/* Task Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </Card>
      )}
    </div>
  );
};