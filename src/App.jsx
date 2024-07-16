import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        const fetchedQuestions = data.slice(0, 10).map((post) => {
          const words = post.body.split(" ");
          const randomIndices = generateRandomIndices(words.length);
          const options = randomIndices.map((index, idx) => {
            const letter = String.fromCharCode(97 + idx);
            return `${letter}. ${words[index]}`;
          });
          return {
            question: post.body,
            options: options,
          };
        });

        setQuestions(fetchedQuestions);
        setAnswers(Array(fetchedQuestions.length).fill(null));
      });
  }, []);
  function generateRandomIndices(length) {
    const indices = [];
    while (indices.length < 4) {
      const randomIndex = Math.floor(Math.random() * length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  }
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanClick(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCanClick(true);
      }
    }
  }, [timeLeft, currentQuestion, questions.length]);

  useEffect(() => {
    if (timeLeft > 20) {
      setCanClick(false);
    } else {
      setCanClick(true);
    }
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    if (canClick) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answer;
      setAnswers(newAnswers);
    }
  };
  const ClickNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setTimeLeft(30);
  };

  const renderResult = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Question
          </th>
          <th
            scope="col"
            className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Answers
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {questions.map((q, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap w-1/2">
              <div className="text-sm text-gray-900">{q.question}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap w-1/2">
              <div className="text-sm text-gray-900">{answers[index]}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="w-full items-center justify-center">
      <div className="w-full">
        <button
          className="font-bold bg-green-500 disabled:bg-slate-400 focus:bg-green-800 text-white p-4 w-1/2 mb-10 rounded-2xl"
          onClick={ClickNext}
          disabled={!canClick}
        >
          Next Question
        </button>
      </div>
      <div className="w-full justify-center items-center text-center flex">
        {questions.length > 0 ? (
          currentQuestion < questions.length ? (
            <div className="w-1/2 p-5 bg-blue-600 text-white rounded-2xl">
              <h1 className="mb-10 font-bold text-2xl">Question</h1>
              <h1>{questions[currentQuestion].question}</h1>
              <div className="w-full  flex flex-wrap my-10 space-y-5">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    className="w-full text-left p-5 border bg-red-500 disabled:bg-red-300 focus:bg-red-900"
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={!canClick}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <p>{`Remaining time: ${timeLeft} second`}</p>
            </div>
          ) : (
            renderResult()
          )
        ) : (
          <p>Yükleniyor...</p>
        )}
      </div>
    </div>
  );
}

export default App;
