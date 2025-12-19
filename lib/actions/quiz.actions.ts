'use server';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Use Groq AI to generate quiz questions
export const generateQuizQuestions = async (subject: string, topic: string): Promise<QuizQuestion[]> => {
  // Use Groq directly - no fallback to test it properly
  return await generateWithGroq(subject, topic);
};

async function generateWithOpenAI(subject: string, topic: string): Promise<QuizQuestion[]> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = createPrompt(subject, topic);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert ${subject} educator. Generate exactly 10 quiz questions. Return only valid JSON array.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return parseAndValidateQuestions(data.choices[0].message.content, topic);
}

async function generateWithGroq(subject: string, topic: string): Promise<QuizQuestion[]> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  const prompt = createPrompt(subject, topic);
  
  console.log('Making Groq API request for:', topic);
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert ${subject} educator. Generate exactly 10 quiz questions about ${topic}. Return only valid JSON array with no extra text.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API error details:', response.status, errorText);
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return parseAndValidateQuestions(data.choices[0].message.content, topic);
}

function createPrompt(subject: string, topic: string): string {
  return `Create exactly 10 multiple choice questions about "${topic}" in ${subject}.

REQUIREMENTS:
- Questions must be specific to "${topic}" concepts
- Each question needs exactly 4 realistic answer options  
- Test real knowledge: definitions, applications, examples, problem-solving
- Make questions challenging but fair for intermediate learners
- All options should be plausible (avoid obvious wrong answers)

Return ONLY a JSON array:
[
  {
    "id": "1",
    "question": "Specific question about ${topic}?", 
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

Generate exactly 10 questions for: ${topic}`;
}

function parseAndValidateQuestions(content: string, topic: string): QuizQuestion[] {
  // Clean up response
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const questions = JSON.parse(content);
  
  if (!Array.isArray(questions)) {
    throw new Error('AI did not return an array');
  }
  
  // Validate questions
  const validQuestions = questions.filter(q => 
    q.id && 
    q.question && 
    q.question.length > 10 &&
    Array.isArray(q.options) && 
    q.options.length === 4 &&
    q.options.every(opt => opt && opt.length > 3) &&
    typeof q.correctAnswer === 'number' &&
    q.correctAnswer >= 0 && 
    q.correctAnswer < 4 &&
    q.explanation &&
    q.explanation.length > 10
  );
  
  if (validQuestions.length < 8) {
    throw new Error(`Only ${validQuestions.length} valid questions generated`);
  }
  
  return validQuestions.slice(0, 10);
}

function generatePredefinedQuestions(subject: string, topic: string): QuizQuestion[] {
  // High-quality topic-specific questions based on common subjects
  const questionTemplates = {
    maths: {
      recursion: [
        {
          id: "1",
          question: "What is the base case in a recursive function?",
          options: [
            "The condition that stops the recursion",
            "The first function call",
            "The return statement",
            "The loop condition"
          ],
          correctAnswer: 0,
          explanation: "The base case is the condition that stops the recursion from continuing indefinitely."
        },
        {
          id: "2", 
          question: "In recursion, what happens if there's no base case?",
          options: [
            "The function runs faster",
            "Stack overflow occurs",
            "The function returns null",
            "Compilation error"
          ],
          correctAnswer: 1,
          explanation: "Without a base case, the function calls itself indefinitely, leading to stack overflow."
        }
      ],
      algebra: [
        {
          id: "1",
          question: "What is the slope-intercept form of a linear equation?",
          options: ["y = mx + b", "ax + by = c", "y = ax² + bx + c", "x = my + b"],
          correctAnswer: 0,
          explanation: "The slope-intercept form is y = mx + b, where m is the slope and b is the y-intercept."
        }
      ]
    },
    science: {
      photosynthesis: [
        {
          id: "1",
          question: "What is the primary purpose of photosynthesis?",
          options: [
            "To produce oxygen for animals",
            "To convert light energy into chemical energy",
            "To absorb carbon dioxide",
            "To create chlorophyll"
          ],
          correctAnswer: 1,
          explanation: "Photosynthesis converts light energy into chemical energy (glucose) that plants can use."
        }
      ]
    },
    coding: {
      recursion: [
        {
          id: "1",
          question: "What is tail recursion?",
          options: [
            "Recursion at the end of a program",
            "When the recursive call is the last operation in the function",
            "Recursion that uses a tail data structure",
            "The final recursive call in a series"
          ],
          correctAnswer: 1,
          explanation: "Tail recursion occurs when the recursive call is the last operation performed in the function."
        },
        {
          id: "2",
          question: "Which data structure is used to manage recursive function calls?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correctAnswer: 1,
          explanation: "The call stack is used to manage recursive function calls, storing each function's local variables and return address."
        },
        {
          id: "3",
          question: "What is the time complexity of calculating Fibonacci numbers using naive recursion?",
          options: ["O(n)", "O(log n)", "O(2^n)", "O(n²)"],
          correctAnswer: 2,
          explanation: "Naive recursive Fibonacci has O(2^n) time complexity due to redundant calculations."
        }
      ]
    }
  };

  const subjectKey = subject.toLowerCase() as keyof typeof questionTemplates;
  const topicKey = topic.toLowerCase().replace(/\s+/g, '');
  
  let questions = questionTemplates[subjectKey]?.[topicKey as keyof typeof questionTemplates[typeof subjectKey]] || [];
  
  // If we don't have specific questions, create generic but good ones
  if (questions.length === 0) {
    questions = [
      {
        id: "1",
        question: `What is a fundamental principle of ${topic}?`,
        options: [
          `${topic} follows systematic rules and patterns`,
          `${topic} is completely random`,
          `${topic} has no practical applications`,
          `${topic} cannot be learned systematically`
        ],
        correctAnswer: 0,
        explanation: `${topic} in ${subject} follows systematic principles that can be learned and applied.`
      },
      {
        id: "2",
        question: `How is ${topic} typically applied in ${subject}?`,
        options: [
          `Through memorization only`,
          `By understanding concepts and practicing applications`,
          `By avoiding complex problems`,
          `Through guesswork`
        ],
        correctAnswer: 1,
        explanation: `${topic} is best learned through understanding core concepts and practicing their applications.`
      }
    ];
  }

  // Ensure we have 10 questions by repeating and modifying existing ones
  while (questions.length < 10) {
    const baseQuestion = questions[questions.length % questions.length];
    const newQuestion = {
      ...baseQuestion,
      id: (questions.length + 1).toString(),
      question: baseQuestion.question.replace(/What is/, `Which statement about`)
    };
    questions.push(newQuestion);
  }

  return questions.slice(0, 10);
}