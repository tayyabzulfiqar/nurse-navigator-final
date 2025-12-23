import { motion } from 'framer-motion';

/**
 * ProfileCompletionIndicator Component
 * Shows a visual progress indicator for profile completion
 */

interface ProfileCompletionIndicatorProps {
  firstName: string | null;
  lastName: string | null;
  department: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
}

export function ProfileCompletionIndicator({
  firstName,
  lastName,
  department,
  jobTitle,
  avatarUrl,
}: ProfileCompletionIndicatorProps) {
  // Calculate completion percentage
  const fields = [
    { name: 'First Name', filled: !!firstName?.trim() },
    { name: 'Last Name', filled: !!lastName?.trim() },
    { name: 'Department', filled: !!department?.trim() },
    { name: 'Job Title', filled: !!jobTitle?.trim() },
    { name: 'Avatar', filled: !!avatarUrl },
  ];

  const filledCount = fields.filter((f) => f.filled).length;
  const percentage = Math.round((filledCount / fields.length) * 100);

  const getStatusColor = () => {
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-orange-600';
  };

  const getProgressColor = () => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-muted/50 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">Profile Completion</span>
        <span className={`text-sm font-bold ${getStatusColor()}`}>{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full ${getProgressColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Field checklist */}
      <div className="flex flex-wrap gap-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
              field.filled
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {field.filled ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
            {field.name}
          </div>
        ))}
      </div>

      {percentage === 100 && (
        <p className="text-xs text-green-600 mt-3 font-medium">
          🎉 Your profile is complete!
        </p>
      )}
    </div>
  );
}
