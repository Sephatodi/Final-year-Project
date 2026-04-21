import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const StepProgress = ({ currentStep, totalSteps = 5, steps = [] }) => {
  const { t } = useTranslation();

  const defaultSteps = [
    { id: 1, label: t('symptomChecker.step1') || 'Species', icon: 'pets' },
    { id: 2, label: t('symptomChecker.step2') || 'Area', icon: 'psychology' },
    { id: 3, label: t('symptomChecker.step3') || 'Symptoms', icon: 'sick' },
    { id: 4, label: t('symptomChecker.step4') || 'Photos', icon: 'photo_camera' },
    { id: 5, label: t('symptomChecker.step5') || 'Results', icon: 'analytics' },
  ];

  const displaySteps = steps.length ? steps : defaultSteps;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="w-full h-2 bg-sage-200 dark:bg-sage-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {displaySteps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center flex-1 ${
                isActive ? 'text-primary' : 
                isCompleted ? 'text-green-600' : 
                'text-sage-400'
              }`}
            >
              {/* Step Circle */}
              <div className={`relative mb-2`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' 
                    : isCompleted
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                    : 'bg-sage-100 dark:bg-sage-800 text-sage-400'
                }`}>
                  {isCompleted ? (
                    <span className="material-icons-outlined">check</span>
                  ) : (
                    <span className="material-icons-outlined">{step.icon}</span>
                  )}
                </div>

                {/* Pulse Animation for Active Step */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                )}
              </div>

              {/* Step Label */}
              <span className={`text-xs font-medium text-center hidden sm:block ${
                isActive ? 'text-primary' : 
                isCompleted ? 'text-green-600' : 
                'text-sage-400'
              }`}>
                {step.label}
              </span>

              {/* Step Number (mobile) */}
              <span className="text-xs sm:hidden">
                {stepNumber}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Step Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-sage-500">
          {t('symptomChecker.step') || 'Step'} {currentStep} {t('symptomChecker.of') || 'of'} {totalSteps}:{' '}
          <span className="font-medium text-sage-700 dark:text-sage-300">
            {displaySteps[currentStep - 1]?.label}
          </span>
        </p>
      </div>
    </div>
  );
};

StepProgress.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
};

export default StepProgress;