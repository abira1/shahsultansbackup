import React from 'react';
interface QuestionTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}
const QuestionTypeCard: React.FC<QuestionTypeCardProps> = ({
  title,
  description,
  icon,
  onClick
}) => {
  return <button onClick={onClick} className="flex flex-col items-center p-6 border border-secondary-dark rounded-lg hover:border-primary hover:bg-secondary transition-colors text-left">
      <div className="bg-primary/10 p-3 rounded-full mb-3">{icon}</div>
      <h3 className="text-base font-medium text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-secondary">{description}</p>
    </button>;
};
export default QuestionTypeCard;