import React from 'react'
import { Question } from '../../context/ExamContext'
import MultipleChoiceQuestion from './question-types/MultipleChoiceQuestion'
import MultipleChoiceMultipleAnswerQuestion from './question-types/MultipleChoiceMultipleAnswerQuestion'
import FillInBlankQuestion from './question-types/FillInBlankQuestion'
import TrueFalseQuestion from './question-types/TrueFalseQuestion'
import YesNoQuestion from './question-types/YesNoQuestion'
import TableCompletionQuestion from './question-types/TableCompletionQuestion'
import SummaryCompletionQuestion from './question-types/SummaryCompletionQuestion'
import DiagramQuestion from './question-types/DiagramQuestion'
import MatchingHeadingsQuestion from './question-types/MatchingHeadingsQuestion'
import DragDropQuestion from './question-types/DragDropQuestion'
import SentenceCompletionQuestion from './question-types/SentenceCompletionQuestion'
import ShortAnswerQuestion from './question-types/ShortAnswerQuestion'

interface QuestionTypeRendererProps {
  question: Question
  disabled?: boolean
}

const QuestionTypeRenderer: React.FC<QuestionTypeRendererProps> = ({
  question,
  disabled = false,
}) => {
  switch (question.type) {
    case 'mcq':
      return <MultipleChoiceQuestion question={question} disabled={disabled} />
    case 'mcq_multiple':
      return (
        <MultipleChoiceMultipleAnswerQuestion
          question={question}
          disabled={disabled}
        />
      )
    case 'fill':
      return <FillInBlankQuestion question={question} disabled={disabled} />
    case 'tf':
      return <TrueFalseQuestion question={question} disabled={disabled} />
    case 'yn':
      return <YesNoQuestion question={question} disabled={disabled} />
    case 'table':
      return <TableCompletionQuestion question={question} disabled={disabled} />
    case 'summary':
      return (
        <SummaryCompletionQuestion question={question} disabled={disabled} />
      )
    case 'summary_list':
      return (
        <SummaryCompletionQuestion
          question={question}
          fromList={true}
          disabled={disabled}
        />
      )
    case 'diagram':
      return <DiagramQuestion question={question} disabled={disabled} />
    case 'matching_headings':
      return (
        <MatchingHeadingsQuestion question={question} disabled={disabled} />
      )
    case 'drag_drop':
      return <DragDropQuestion question={question} disabled={disabled} />
    case 'sentence_completion':
      return (
        <SentenceCompletionQuestion question={question} disabled={disabled} />
      )
    case 'short_answer':
      return <ShortAnswerQuestion question={question} disabled={disabled} />
    default:
      return (
        <div className="text-red-500">
          Unsupported question type: {question.type}
        </div>
      )
  }
}

export default QuestionTypeRenderer