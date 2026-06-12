import { Check } from 'lucide-react';

const WORKFLOW_STATUSES = [
  'Design Received',
  'Client Approval',
  'Printing/Engraving',
  'Packaging',
  'Quality Check',
  'Dispatch',
  'Delivered'
];

function StatusTimeline({ currentStatus }) {
  const currentIndex = WORKFLOW_STATUSES.indexOf(currentStatus);
  const progressPercentage = currentIndex === -1 ? 0 : (currentIndex / (WORKFLOW_STATUSES.length - 1)) * 100;

  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      <div className="timeline-progress" style={{ width: `${progressPercentage}%` }}></div>
      
      {WORKFLOW_STATUSES.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        
        let stepClass = 'timeline-step';
        if (isCompleted) stepClass += ' completed';
        if (isActive) stepClass += ' active';

        return (
          <div key={status} className={stepClass}>
            <div className="timeline-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isCompleted && <Check size={14} color="white" />}
            </div>
            <div className="timeline-label">{status}</div>
          </div>
        );
      })}
    </div>
  );
}

export default StatusTimeline;
