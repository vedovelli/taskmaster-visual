import { useState } from 'react';
import { ProjectLoader } from '@/components/ProjectLoader';
import { TaskMasterLayout } from '@/components/TaskMasterLayout';

const Index = () => {
  const [projectLoaded, setProjectLoaded] = useState(false);

  if (!projectLoaded) {
    return <ProjectLoader onLoadProject={() => setProjectLoaded(true)} />;
  }

  return <TaskMasterLayout onBack={() => setProjectLoaded(false)} />;
};

export default Index;
