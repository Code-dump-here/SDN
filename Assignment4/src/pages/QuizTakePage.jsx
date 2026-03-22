import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuiz, clearCurrent } from "../store/quizSlice";

export default function QuizTakePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: quiz, loading, error } = useSelector((s) => s.quizzes);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    dispatch(fetchQuiz(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!quiz?.questions) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswerIndex) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!quiz) return null;

  const questions = quiz.questions || [];

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate("/")}>
        &larr; Back
      </button>
      <h2>{quiz.title}</h2>
      <p className="text-muted">{quiz.description}</p>
      <hr />

      {submitted && (
        <div className="alert alert-success text-center fs-5">
          Your score: <strong>{score} / {questions.length}</strong>
          <div className="mt-2">
            <button className="btn btn-primary me-2" onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); }}>
              Retry
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
              Back to Quizzes
            </button>
          </div>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="alert alert-warning">This quiz has no questions yet.</div>
      ) : (
        <>
          {questions.map((q, qi) => {
            const selected = answers[q._id];
            const isCorrect = submitted && selected === q.correctAnswerIndex;
            const isWrong = submitted && selected !== undefined && selected !== q.correctAnswerIndex;

            return (
              <div key={q._id} className={`card mb-3 ${submitted ? (isCorrect ? "border-success" : isWrong ? "border-danger" : "border-secondary") : ""}`}>
                <div className="card-body">
                  <p className="fw-semibold mb-3">
                    {qi + 1}. {q.text}
                    {submitted && isCorrect && <span className="badge bg-success ms-2">Correct</span>}
                    {submitted && isWrong && <span className="badge bg-danger ms-2">Wrong</span>}
                    {submitted && selected === undefined && <span className="badge bg-secondary ms-2">Skipped</span>}
                  </p>
                  <div className="d-flex flex-column gap-2">
                    {q.options.map((opt, oi) => {
                      let btnClass = "btn btn-outline-secondary text-start";
                      if (selected === oi) btnClass = "btn btn-primary text-start";
                      if (submitted && oi === q.correctAnswerIndex) btnClass = "btn btn-success text-start";
                      if (submitted && selected === oi && oi !== q.correctAnswerIndex) btnClass = "btn btn-danger text-start";

                      return (
                        <button
                          key={oi}
                          className={btnClass}
                          onClick={() => handleSelect(q._id, oi)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {!submitted && (
            <button
              className="btn btn-success w-100 mb-4"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
            >
              Submit Quiz
            </button>
          )}
        </>
      )}
    </div>
  );
}
