import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight,
  Link2,
  TestTube,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, Subtask } from '@/data/mockTasks';
import { SubtaskCard } from './SubtaskCard';

interface TaskCardProps {
  task: Task;
}

const statusConfig = {
  'done': {
    icon: CheckCircle,
    color: 'text-status-done',
    bgColor: 'bg-status-done/10',
    borderColor: 'border-status-done/30',
    label: 'Done'
  },
  'in-progress': {
    icon: Clock,
    color: 'text-status-in-progress',
    bgColor: 'bg-status-in-progress/10',
    borderColor: 'border-status-in-progress/30',
    label: 'In Progress'
  },
  'pending': {
    icon: Clock,
    color: 'text-status-pending',
    bgColor: 'bg-status-pending/10',
    borderColor: 'border-status-pending/30',
    label: 'Pending'
  },
  'blocked': {
    icon: AlertTriangle,
    color: 'text-status-blocked',
    bgColor: 'bg-status-blocked/10',
    borderColor: 'border-status-blocked/30',
    label: 'Blocked'
  }
};

const priorityConfig = {
  'high': {
    color: 'bg-priority-high text-white',
    label: 'HIGH'
  },
  'medium': {
    color: 'bg-priority-medium text-primary-foreground',
    label: 'MEDIUM'
  },
  'low': {
    color: 'bg-priority-low text-white',
    label: 'LOW'
  }
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  const statusInfo = statusConfig[task.status];
  const priorityInfo = priorityConfig[task.priority];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className={cn(
      "group relative transition-all duration-300 hover:shadow-lg border-l-4",
      statusInfo.borderColor,
      "hover:border-l-primary/50"
    )}>
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg",
              statusInfo.bgColor
            )}>
              <StatusIcon className={cn("w-4 h-4", statusInfo.color)} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-mono text-muted-foreground">#{task.id}</span>
                <Badge variant="secondary" className={priorityInfo.color}>
                  {priorityInfo.label}
                </Badge>
                <Badge variant="outline" className={cn(
                  "text-xs",
                  statusInfo.color,
                  statusInfo.bgColor
                )}>
                  {statusInfo.label}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {task.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>
        </div>

        {/* Dependencies */}
        {task.dependencies.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Depends on:</span>
            <div className="flex space-x-1">
              {task.dependencies.map((depId) => (
                <Badge key={depId} variant="outline" className="text-xs">
                  #{depId}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Details
            </Button>
            
            {task.subtasks && task.subtasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showSubtasks ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                {task.subtasks.length} Subtask{task.subtasks.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border/50 pt-4 space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Details</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {task.details}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TestTube className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Test Strategy</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {task.testStrategy}
            </p>
          </div>
        </div>
      )}

      {/* Subtasks */}
      {showSubtasks && task.subtasks && task.subtasks.length > 0 && (
        <div className="px-6 pb-6 border-t border-border/50 pt-4">
          <div className="space-y-3">
            {task.subtasks.map((subtask) => (
              <SubtaskCard key={subtask.id} subtask={subtask} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};