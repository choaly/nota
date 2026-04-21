import { useState } from 'react';
import styles from './Quiz.module.css';

export default function Quiz({ questions, onClose }) {
    const [currentQuestion, setCurrentQuestion] = useState(0); //index of which question we're on (0, 1, 2, 3, 4)

    const [selectedAnswer, setSelectedAnswer] = useState(''); //which option the user clicked for the current question

    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false); //whether to show if their answer was correct/incorrect
    const [quizComplete, setQuizComplete] = useState(false); //whether all 5 questions are done

    const current = questions[currentQuestion];

    function handleAnswer(option) {
        setSelectedAnswer(option);
        if (option === current.answer) {
            setScore(score+1);
        }
        setShowResult(true);

        //setTimeout for 1 second
        setTimeout(() => {
            //if currentQuestion is the last one
            if (currentQuestion + 1 === questions.length) {
                setQuizComplete(true);
            } else {
                setCurrentQuestion(currentQuestion+1);
                setSelectedAnswer('');
                setShowResult(false);
            }
        }, 1000);
    }

    if (quizComplete) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <h2 className={styles.completeTitle}>Quiz Complete!</h2>
                    <p className={styles.scoreText}>You scored {score} out of {questions.length}</p>
                    <button className={styles.closeButton} onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.progress}>Question {currentQuestion + 1} of {questions.length}</h3>
                <p className={styles.questionText}>{current.question}</p>

                <div className={styles.options}>
                    {current.options.map((option, index) => (
                        <button
                            key={index}
                            className={`${styles.optionButton} ${showResult && option === current.answer ? styles.correct : ''} ${showResult && option === selectedAnswer && option !== current.answer ? styles.incorrect : ''}`}
                            onClick={() => handleAnswer(option)}
                            disabled={showResult}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}