import { useState } from 'react';
import { evaluateExplanation } from '../services/explain';
import styles from './ExplainBack.module.css';

export default function ExplainBack({ questions, onClose }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [evaluating, setEvaluating] = useState(false);
    const [results, setResults] = useState([]); // stores all evaluations
    const [quizComplete, setQuizComplete] = useState(false);

    const current = questions[currentQuestion];

    async function handleSubmit() {
        if (!userAnswer.trim()) return;

        setEvaluating(true);
        try {
            const data = await evaluateExplanation(
                current.question,
                userAnswer,
                current.keyConcepts,
                current.sampleAnswer
            );
            setEvaluation(data.evaluation);
            setResults([...results, data.evaluation]);
        } catch (error) {
            alert('Failed to evaluate: ' + error.message);
        } finally {
            setEvaluating(false);
        }
    }

    function handleNext() {
        if (currentQuestion + 1 === questions.length) {
            setQuizComplete(true);
        } else {
            setCurrentQuestion(currentQuestion + 1);
            setUserAnswer('');
            setEvaluation(null);
        }
    }

    if (quizComplete) {
        const strong = results.filter(r => r.rating === 'strong').length;
        const partial = results.filter(r => r.rating === 'partial').length;
        const weak = results.filter(r => r.rating === 'weak').length;

        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <h2 className={styles.completeTitle}>Explain-Back Complete!</h2>
                    <div className={styles.summaryStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{strong}</span>
                            <span className={styles.statLabel}>Strong</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{partial}</span>
                            <span className={styles.statLabel}>Partial</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{weak}</span>
                            <span className={styles.statLabel}>Needs Work</span>
                        </div>
                    </div>

                    <div className={styles.reviewSection}>
                        {results.map((result, index) => (
                            <div key={index} className={styles.reviewItem}>
                                <div className={styles.reviewHeader}>
                                    <span className={styles.reviewNumber}>Q{index + 1}</span>
                                    <span className={`${styles.ratingBadge} ${styles[result.rating]}`}>
                                        {result.rating}
                                    </span>
                                </div>
                                <p className={styles.reviewFeedback}>{result.feedback}</p>
                            </div>
                        ))}
                    </div>

                    <button className={styles.closeButton} onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.progress}>
                    Question {currentQuestion + 1} of {questions.length}
                </h3>

                <p className={styles.questionText}>{current.question}</p>

                {!evaluation ? (
                    <>
                        <textarea
                            className={styles.answerInput}
                            placeholder="Explain in your own words..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            rows={5}
                            disabled={evaluating}
                        />
                        <button
                            className={styles.submitButton}
                            onClick={handleSubmit}
                            disabled={evaluating || !userAnswer.trim()}
                        >
                            {evaluating ? 'Evaluating...' : 'Submit Explanation'}
                        </button>
                    </>
                ) : (
                    <div className={styles.feedbackSection}>
                        <div className={`${styles.ratingBanner} ${styles[evaluation.rating]}`}>
                            {evaluation.rating === 'strong' && 'Strong Explanation'}
                            {evaluation.rating === 'partial' && 'Partial Understanding'}
                            {evaluation.rating === 'weak' && 'Needs Work'}
                        </div>

                        <p className={styles.feedbackText}>{evaluation.feedback}</p>

                        {evaluation.conceptsCovered.length > 0 && (
                            <div className={styles.conceptGroup}>
                                <span className={styles.conceptLabel}>Covered:</span>
                                <div className={styles.conceptTags}>
                                    {evaluation.conceptsCovered.map((c, i) => (
                                        <span key={i} className={styles.coveredTag}>{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {evaluation.conceptsMissed.length > 0 && (
                            <div className={styles.conceptGroup}>
                                <span className={styles.conceptLabel}>Missed:</span>
                                <div className={styles.conceptTags}>
                                    {evaluation.conceptsMissed.map((c, i) => (
                                        <span key={i} className={styles.missedTag}>{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button className={styles.nextButton} onClick={handleNext}>
                            {currentQuestion + 1 === questions.length ? 'See Results' : 'Next Question'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
