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
  CornerDownRight,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Subtask } from '@/data/mockTasks';

interface SubtaskCardProps {
  subtask: Subtask;
}

const statusConfig = {
  'done': {
    icon: CheckCircle,
    color: 'text-status-done',
    bgColor: 'bg-status-done/10',
    label: 'Done'
  },
  'in-progress': {
    icon: Clock,
    color: 'text-status-in-progress',
    bgColor: 'bg-status-in-progress/10',
    label: 'In Progress'
  },
  'pending': {
    icon: Clock,
    color: 'text-status-pending',
    bgColor: 'bg-status-pending/10',
    label: 'Pending'
  },
  'blocked': {
    icon: AlertTriangle,
    color: 'text-status-blocked',
    bgColor: 'bg-status-blocked/10',
    label: 'Blocked'
  }
};

export const SubtaskCard = ({ subtask }: SubtaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusInfo = statusConfig[subtask.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="ml-6 border-l-2 border-l-muted bg-muted/20 transition-all duration-200 hover:bg-muted/30">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Nesting Indicator */}
          <CornerDownRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded",
                statusInfo.bgColor
              )}>
                <StatusIcon className={cn("w-3 h-3", statusInfo.color)} />
              </div>
              
              <span className="text-xs font-mono text-muted-foreground">#{subtask.id}</span>
              
              <Badge variant="outline" className={cn(
                "text-xs",
                statusInfo.color,
                statusInfo.bgColor
              )}>
                {statusInfo.label}
              </Badge>
            </div>
            
            <h4 className="text-sm font-medium text-foreground mb-1">
              {subtask.title}
            </h4>
            
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {subtask.description}
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Details
            </Button>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex items-start space-x-2">
                  <FileText className="w-3 h-3 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-xs font-medium text-foreground">Details</span>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {subtask.details}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};