'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { generateQuizQuestions } from '@/lib/actions/quiz.actions';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizSectionProps {
  subject: string;
  topic: string;
  isProUser: boolean;
}

const QuizSection = ({ subject, topic, isProUser }: QuizSectionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateQuizQuestions(subject, topic);
      if (generatedQuestions.length < 10) {
        console.warn(`Only got ${generatedQuestions.length} questions for ${topic}`);
      }
      setQuestions(generatedQuestions);
      setQuizStarted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz questions. Please try again.');
      console.error('Quiz generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isProUser) {
    return (
      <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-bold mb-2">Quiz Feature - Pro Only</h3>
          <p className="text-gray-600 mb-4">
            Test your knowledge with interactive quizzes! This feature is available for Core Learner Pro subscribers.
          </p>
          <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
            <div className="flex items-center justify-center gap-2">
              <span>✓</span> Interactive quizzes for all subjects
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>✓</span> Instant feedback and explanations
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>✓</span> Track your quiz performance
            </div>
          </div>
          <Link href="/subscription">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Upgrade to Pro
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="mt-8 p-6 border border-blue-200 rounded-lg bg-blue-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-bold mb-2">Knowledge Quiz</h3>
          <p className="text-gray-700 mb-4">
            Test your understanding of {topic} with 10 questions
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={loadQuestions}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Questions...' : 'Start Quiz'}
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="mt-8 p-6 border border-green-200 rounded-lg bg-green-50">
        <div className="text-center">
          <div className="text-4xl mb-4">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
          </div>
          <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
          <div className="text-2xl font-bold text-green-600 mb-2">
            {correctAnswers}/{questions.length} Correct
          </div>
          <div className="text-lg mb-4">{percentage}% Score</div>
          
          <div className="text-left space-y-4 mb-6">
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 bg-white rounded-lg border">
                <p className="font-medium mb-2">{question.question}</p>
                <div className="text-sm">
                  <p className={cn(
                    "mb-1",
                    selectedAnswers[index] === question.correctAnswer 
                      ? "text-green-600" 
                      : "text-red-600"
                  )}>
                    Your answer: {question.options[selectedAnswers[index]]}
                  </p>
                  {selectedAnswers[index] !== question.correctAnswer && (
                    <p className="text-green-600 mb-1">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                  )}
                  <p className="text-gray-600 text-xs">{question.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswers([]);
              setShowResults(false);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="mt-8 p-6 border border-blue-200 rounded-lg bg-blue-50">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Quiz: {topic}</h3>
          <span className="text-sm text-gray-600">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">{currentQ.question}</h4>
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={cn(
                "w-full p-3 text-left border rounded-lg transition-colors",
                selectedAnswers[currentQuestion] === index
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuizSection;