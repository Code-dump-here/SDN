import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchQuizzes } from "../store/quizSlice";

export default function QuizListPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Quizzes</h2>
      {list.length === 0 ? (
        <div className="alert alert-info">No quizzes available yet.</div>
      ) : (
        <div className="row g-3">
          {list.map((quiz) => (
            <div key={quiz._id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{quiz.title}</h5>
                  <p className="card-text text-muted flex-grow-1">{quiz.description}</p>
                  <p className="card-text">
                    <small className="text-muted">{quiz.questions?.length || 0} question(s)</small>
                  </p>
                  <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary mt-auto">
                    Take Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
