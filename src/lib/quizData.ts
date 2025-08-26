// Comprehensive Quiz Database with 50 Questions
export interface QuizQuestion {
  id: string;
  category: string;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export const QUIZ_DATABASE: QuizQuestion[] = [
  // General Knowledge Questions (10)
  {
    id: 'gk-1',
    category: 'General Knowledge',
    question_text: 'What is the capital of France?',
    options: { 'A': 'London', 'B': 'Berlin', 'C': 'Paris', 'D': 'Madrid' },
    correct_answer: 'C',
    explanation: 'Paris is the capital and largest city of France.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk-2',
    category: 'General Knowledge',
    question_text: 'Which planet is known as the Red Planet?',
    options: { 'A': 'Venus', 'B': 'Mars', 'C': 'Jupiter', 'D': 'Saturn' },
    correct_answer: 'B',
    explanation: 'Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk-3',
    category: 'General Knowledge',
    question_text: 'What is the largest ocean on Earth?',
    options: { 'A': 'Atlantic Ocean', 'B': 'Indian Ocean', 'C': 'Arctic Ocean', 'D': 'Pacific Ocean' },
    correct_answer: 'D',
    explanation: 'The Pacific Ocean is the largest ocean covering about 1/3 of Earth\'s surface.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk-4',
    category: 'General Knowledge',
    question_text: 'How many continents are there on Earth?',
    options: { 'A': '5', 'B': '6', 'C': '7', 'D': '8' },
    correct_answer: 'C',
    explanation: 'There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk-5',
    category: 'General Knowledge',
    question_text: 'What is the smallest country in the world?',
    options: { 'A': 'Monaco', 'B': 'Vatican City', 'C': 'San Marino', 'D': 'Liechtenstein' },
    correct_answer: 'B',
    explanation: 'Vatican City is the smallest country in the world with an area of just 0.17 square miles.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'gk-6',
    category: 'General Knowledge',
    question_text: 'Which element has the chemical symbol "O"?',
    options: { 'A': 'Gold', 'B': 'Silver', 'C': 'Oxygen', 'D': 'Iron' },
    correct_answer: 'C',
    explanation: 'Oxygen has the chemical symbol "O" and is essential for life on Earth.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk-7',
    category: 'General Knowledge',
    question_text: 'What is the longest river in the world?',
    options: { 'A': 'Amazon River', 'B': 'Nile River', 'C': 'Mississippi River', 'D': 'Yangtze River' },
    correct_answer: 'B',
    explanation: 'The Nile River is the longest river in the world, flowing over 4,100 miles.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'gk-8',
    category: 'General Knowledge',
    question_text: 'How many sides does a hexagon have?',
    options: { 'A': '5', 'B': '6', 'C': '7', 'D': '8' },
    correct_answer: 'B',
    explanation: 'A hexagon is a polygon with six sides and six angles.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk-9',
    category: 'General Knowledge',
    question_text: 'What is the hardest natural substance on Earth?',
    options: { 'A': 'Gold', 'B': 'Iron', 'C': 'Diamond', 'D': 'Platinum' },
    correct_answer: 'C',
    explanation: 'Diamond is the hardest natural substance on Earth, rating 10 on the Mohs scale.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'gk-10',
    category: 'General Knowledge',
    question_text: 'Which gas makes up most of Earth\'s atmosphere?',
    options: { 'A': 'Oxygen', 'B': 'Carbon Dioxide', 'C': 'Nitrogen', 'D': 'Hydrogen' },
    correct_answer: 'C',
    explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.',
    difficulty: 'medium',
    points: 15
  },

  // Science Questions (10)
  {
    id: 'sci-1',
    category: 'Science',
    question_text: 'What is the chemical symbol for gold?',
    options: { 'A': 'Go', 'B': 'Gd', 'C': 'Au', 'D': 'Ag' },
    correct_answer: 'C',
    explanation: 'Au comes from the Latin word "aurum" meaning gold.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'sci-2',
    category: 'Science',
    question_text: 'How many bones are there in an adult human body?',
    options: { 'A': '196', 'B': '206', 'C': '216', 'D': '226' },
    correct_answer: 'B',
    explanation: 'An adult human body has 206 bones.',
    difficulty: 'hard',
    points: 20
  },
  {
    id: 'sci-3',
    category: 'Science',
    question_text: 'What gas do plants absorb from the atmosphere during photosynthesis?',
    options: { 'A': 'Oxygen', 'B': 'Nitrogen', 'C': 'Carbon Dioxide', 'D': 'Hydrogen' },
    correct_answer: 'C',
    explanation: 'Plants absorb carbon dioxide and release oxygen during photosynthesis.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sci-4',
    category: 'Science',
    question_text: 'What is the speed of light in a vacuum?',
    options: { 'A': '299,792,458 m/s', 'B': '300,000,000 m/s', 'C': '299,000,000 m/s', 'D': '298,792,458 m/s' },
    correct_answer: 'A',
    explanation: 'The speed of light in a vacuum is exactly 299,792,458 meters per second.',
    difficulty: 'hard',
    points: 20
  },
  {
    id: 'sci-5',
    category: 'Science',
    question_text: 'Which organ in the human body produces insulin?',
    options: { 'A': 'Liver', 'B': 'Kidney', 'C': 'Pancreas', 'D': 'Heart' },
    correct_answer: 'C',
    explanation: 'The pancreas produces insulin, which regulates blood sugar levels.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'sci-6',
    category: 'Science',
    question_text: 'What is the atomic number of hydrogen?',
    options: { 'A': '0', 'B': '1', 'C': '2', 'D': '3' },
    correct_answer: 'B',
    explanation: 'Hydrogen has an atomic number of 1, meaning it has one proton.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'sci-7',
    category: 'Science',
    question_text: 'Which blood type is known as the universal donor?',
    options: { 'A': 'A', 'B': 'B', 'C': 'AB', 'D': 'O' },
    correct_answer: 'D',
    explanation: 'Type O blood is the universal donor because it can be given to people with any blood type.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'sci-8',
    category: 'Science',
    question_text: 'What is the largest organ in the human body?',
    options: { 'A': 'Brain', 'B': 'Liver', 'C': 'Skin', 'D': 'Lungs' },
    correct_answer: 'C',
    explanation: 'The skin is the largest organ in the human body, covering the entire body surface.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sci-9',
    category: 'Science',
    question_text: 'What is the chemical formula for water?',
    options: { 'A': 'H2O', 'B': 'CO2', 'C': 'O2', 'D': 'H2O2' },
    correct_answer: 'A',
    explanation: 'Water has the chemical formula H2O, meaning two hydrogen atoms and one oxygen atom.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sci-10',
    category: 'Science',
    question_text: 'Which planet is closest to the Sun?',
    options: { 'A': 'Venus', 'B': 'Earth', 'C': 'Mercury', 'D': 'Mars' },
    correct_answer: 'C',
    explanation: 'Mercury is the closest planet to the Sun in our solar system.',
    difficulty: 'easy',
    points: 10
  },

  // History Questions (10)
  {
    id: 'hist-1',
    category: 'History',
    question_text: 'In which year did World War II end?',
    options: { 'A': '1944', 'B': '1945', 'C': '1946', 'D': '1947' },
    correct_answer: 'B',
    explanation: 'World War II ended in 1945 with the surrender of Japan.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'hist-2',
    category: 'History',
    question_text: 'Who was the first person to walk on the moon?',
    options: { 'A': 'Buzz Aldrin', 'B': 'Neil Armstrong', 'C': 'John Glenn', 'D': 'Alan Shepard' },
    correct_answer: 'B',
    explanation: 'Neil Armstrong was the first person to walk on the moon on July 20, 1969.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'hist-3',
    category: 'History',
    question_text: 'Which ancient wonder of the world was located in Alexandria?',
    options: { 'A': 'Hanging Gardens', 'B': 'Colossus of Rhodes', 'C': 'Lighthouse of Alexandria', 'D': 'Temple of Artemis' },
    correct_answer: 'C',
    explanation: 'The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World.',
    difficulty: 'hard',
    points: 20
  },
  {
    id: 'hist-4',
    category: 'History',
    question_text: 'Who was the first President of the United States?',
    options: { 'A': 'Thomas Jefferson', 'B': 'John Adams', 'C': 'George Washington', 'D': 'Benjamin Franklin' },
    correct_answer: 'C',
    explanation: 'George Washington was the first President of the United States, serving from 1789 to 1797.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'hist-5',
    category: 'History',
    question_text: 'In which year did the Berlin Wall fall?',
    options: { 'A': '1987', 'B': '1988', 'C': '1989', 'D': '1990' },
    correct_answer: 'C',
    explanation: 'The Berlin Wall fell on November 9, 1989, marking the beginning of German reunification.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'hist-6',
    category: 'History',
    question_text: 'Which empire was ruled by Julius Caesar?',
    options: { 'A': 'Greek Empire', 'B': 'Roman Empire', 'C': 'Byzantine Empire', 'D': 'Persian Empire' },
    correct_answer: 'B',
    explanation: 'Julius Caesar was a Roman general and statesman who played a critical role in the Roman Empire.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'hist-7',
    category: 'History',
    question_text: 'What year did the Titanic sink?',
    options: { 'A': '1910', 'B': '1911', 'C': '1912', 'D': '1913' },
    correct_answer: 'C',
    explanation: 'The RMS Titanic sank on April 15, 1912, after hitting an iceberg.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'hist-8',
    category: 'History',
    question_text: 'Which country gifted the Statue of Liberty to the United States?',
    options: { 'A': 'England', 'B': 'France', 'C': 'Spain', 'D': 'Italy' },
    correct_answer: 'B',
    explanation: 'France gifted the Statue of Liberty to the United States in 1886 as a symbol of friendship.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'hist-9',
    category: 'History',
    question_text: 'Who wrote the Declaration of Independence?',
    options: { 'A': 'George Washington', 'B': 'Benjamin Franklin', 'C': 'Thomas Jefferson', 'D': 'John Adams' },
    correct_answer: 'C',
    explanation: 'Thomas Jefferson was the primary author of the Declaration of Independence in 1776.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'hist-10',
    category: 'History',
    question_text: 'Which war was fought between the North and South in America?',
    options: { 'A': 'Revolutionary War', 'B': 'Civil War', 'C': 'War of 1812', 'D': 'Spanish-American War' },
    correct_answer: 'B',
    explanation: 'The American Civil War (1861-1865) was fought between the Northern and Southern states.',
    difficulty: 'easy',
    points: 10
  },

  // Technology Questions (10)
  {
    id: 'tech-1',
    category: 'Technology',
    question_text: 'What does "HTML" stand for?',
    options: { 'A': 'Hyper Text Markup Language', 'B': 'High Tech Modern Language', 'C': 'Home Tool Markup Language', 'D': 'Hyperlink and Text Markup Language' },
    correct_answer: 'A',
    explanation: 'HTML stands for Hyper Text Markup Language, used to create web pages.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'tech-2',
    category: 'Technology',
    question_text: 'Which company developed the iPhone?',
    options: { 'A': 'Samsung', 'B': 'Google', 'C': 'Apple', 'D': 'Microsoft' },
    correct_answer: 'C',
    explanation: 'Apple developed and released the first iPhone in 2007.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'tech-3',
    category: 'Technology',
    question_text: 'What does "CPU" stand for?',
    options: { 'A': 'Central Processing Unit', 'B': 'Computer Personal Unit', 'C': 'Central Program Unit', 'D': 'Computer Processing Unit' },
    correct_answer: 'A',
    explanation: 'CPU stands for Central Processing Unit, the main component that executes instructions.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'tech-4',
    category: 'Technology',
    question_text: 'Which programming language was created by Guido van Rossum?',
    options: { 'A': 'Java', 'B': 'Python', 'C': 'C++', 'D': 'JavaScript' },
    correct_answer: 'B',
    explanation: 'Python was created by Guido van Rossum and first released in 1991.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'tech-5',
    category: 'Technology',
    question_text: 'What does "WWW" stand for?',
    options: { 'A': 'World Wide Web', 'B': 'World Wide Work', 'C': 'World Web Wide', 'D': 'Wide World Web' },
    correct_answer: 'A',
    explanation: 'WWW stands for World Wide Web, the system of interlinked hypertext documents.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'tech-6',
    category: 'Technology',
    question_text: 'Which company created the Android operating system?',
    options: { 'A': 'Apple', 'B': 'Microsoft', 'C': 'Google', 'D': 'Samsung' },
    correct_answer: 'C',
    explanation: 'Google acquired Android Inc. and developed the Android operating system.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'tech-7',
    category: 'Technology',
    question_text: 'What is the maximum storage capacity of a standard Blu-ray disc?',
    options: { 'A': '4.7 GB', 'B': '8.5 GB', 'C': '25 GB', 'D': '50 GB' },
    correct_answer: 'C',
    explanation: 'A standard single-layer Blu-ray disc can store up to 25 GB of data.',
    difficulty: 'hard',
    points: 20
  },
  {
    id: 'tech-8',
    category: 'Technology',
    question_text: 'Which protocol is used to transfer web pages?',
    options: { 'A': 'FTP', 'B': 'HTTP', 'C': 'SMTP', 'D': 'TCP' },
    correct_answer: 'B',
    explanation: 'HTTP (HyperText Transfer Protocol) is used to transfer web pages over the internet.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'tech-9',
    category: 'Technology',
    question_text: 'What does "AI" stand for in technology?',
    options: { 'A': 'Automated Intelligence', 'B': 'Artificial Intelligence', 'C': 'Advanced Intelligence', 'D': 'Algorithmic Intelligence' },
    correct_answer: 'B',
    explanation: 'AI stands for Artificial Intelligence, the simulation of human intelligence by machines.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'tech-10',
    category: 'Technology',
    question_text: 'Which social media platform was founded by Mark Zuckerberg?',
    options: { 'A': 'Twitter', 'B': 'Instagram', 'C': 'Facebook', 'D': 'LinkedIn' },
    correct_answer: 'C',
    explanation: 'Facebook was founded by Mark Zuckerberg in 2004 while he was a student at Harvard.',
    difficulty: 'easy',
    points: 10
  },

  // Sports Questions (10)
  {
    id: 'sport-1',
    category: 'Sports',
    question_text: 'How many players are on a basketball team on the court at one time?',
    options: { 'A': '4', 'B': '5', 'C': '6', 'D': '7' },
    correct_answer: 'B',
    explanation: 'A basketball team has 5 players on the court at one time.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sport-2',
    category: 'Sports',
    question_text: 'In which sport would you perform a slam dunk?',
    options: { 'A': 'Tennis', 'B': 'Basketball', 'C': 'Volleyball', 'D': 'Football' },
    correct_answer: 'B',
    explanation: 'A slam dunk is a basketball move where a player scores by putting the ball directly through the hoop.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sport-3',
    category: 'Sports',
    question_text: 'How often are the Summer Olympic Games held?',
    options: { 'A': 'Every 2 years', 'B': 'Every 3 years', 'C': 'Every 4 years', 'D': 'Every 5 years' },
    correct_answer: 'C',
    explanation: 'The Summer Olympic Games are held every 4 years.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sport-4',
    category: 'Sports',
    question_text: 'Which country has won the most FIFA World Cups?',
    options: { 'A': 'Germany', 'B': 'Argentina', 'C': 'Brazil', 'D': 'Italy' },
    correct_answer: 'C',
    explanation: 'Brazil has won the FIFA World Cup 5 times, more than any other country.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'sport-5',
    category: 'Sports',
    question_text: 'In tennis, what is the term for a score of zero?',
    options: { 'A': 'Nil', 'B': 'Love', 'C': 'Zero', 'D': 'Nothing' },
    correct_answer: 'B',
    explanation: 'In tennis, a score of zero is called "love".',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sport-6',
    category: 'Sports',
    question_text: 'Which sport is known as "America\'s pastime"?',
    options: { 'A': 'Football', 'B': 'Basketball', 'C': 'Baseball', 'D': 'Hockey' },
    correct_answer: 'C',
    explanation: 'Baseball is traditionally known as "America\'s pastime".',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sport-7',
    category: 'Sports',
    question_text: 'How many holes are there in a standard round of golf?',
    options: { 'A': '16', 'B': '17', 'C': '18', 'D': '19' },
    correct_answer: 'C',
    explanation: 'A standard round of golf consists of 18 holes.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sport-8',
    category: 'Sports',
    question_text: 'Which athlete holds the record for the most Olympic gold medals?',
    options: { 'A': 'Usain Bolt', 'B': 'Michael Phelps', 'C': 'Carl Lewis', 'D': 'Mark Spitz' },
    correct_answer: 'B',
    explanation: 'Michael Phelps holds the record with 23 Olympic gold medals in swimming.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'sport-9',
    category: 'Sports',
    question_text: 'In which sport do teams compete for the Stanley Cup?',
    options: { 'A': 'Basketball', 'B': 'Football', 'C': 'Baseball', 'D': 'Hockey' },
    correct_answer: 'D',
    explanation: 'The Stanley Cup is the championship trophy for the National Hockey League (NHL).',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sport-10',
    category: 'Sports',
    question_text: 'What is the maximum score possible in ten-pin bowling?',
    options: { 'A': '200', 'B': '250', 'C': '300', 'D': '350' },
    correct_answer: 'C',
    explanation: 'The maximum score in ten-pin bowling is 300, achieved by rolling 12 strikes in a row.',
    difficulty: 'medium',
    points: 15
  }
];

// Function to get random questions from the database
export const getRandomQuestions = (count: number = 10): QuizQuestion[] => {
  const shuffled = [...QUIZ_DATABASE].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Function to get questions by category
export const getQuestionsByCategory = (category: string, count: number = 10): QuizQuestion[] => {
  const categoryQuestions = QUIZ_DATABASE.filter(q => q.category === category);
  const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Function to get mixed questions from all categories
export const getMixedQuestions = (count: number = 10): QuizQuestion[] => {
  return getRandomQuestions(count);
};
