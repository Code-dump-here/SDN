import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } from "../store/quizSlice";
import api from "../api";

export default function AdminPage() {
  const dispatch = useDispatch();
  const { list: quizzes, loading } = useSelector((s) => s.quizzes);
  // const { user } = useSelector((s) => s.auth); // prev: used for isMyQuestion check
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("quizzes");

  // Quiz form state
  const [quizForm, setQuizForm] = useState({ title: "", description: "" });
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Question form state
  const [qForm, setQForm] = useState({ text: "", options: ["", "", "", ""], correctAnswerIndex: 0, keywords: "" });
  const [editingQ, setEditingQ] = useState(null);
  const [qError, setQError] = useState("");

  // Add question to quiz
  const [addToQuiz, setAddToQuiz] = useState("");
  const [selectedQ, setSelectedQ] = useState("");

  useEffect(() => {
    dispatch(fetchQuizzes());
    loadQuestions();
  }, [dispatch]);

  const loadQuestions = async () => {
    const res = await api.get("/questions");
    setQuestions(res.data);
  };

  // --- Quiz CRUD ---
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (editingQuiz) {
      await dispatch(updateQuiz({ id: editingQuiz._id, data: quizForm }));
      setEditingQuiz(null);
    } else {
      await dispatch(createQuiz(quizForm));
    }
    setQuizForm({ title: "", description: "" });
  };

  const handleEditQuiz = (q) => {
    setEditingQuiz(q);
    setQuizForm({ title: q.title, description: q.description });
  };

  const handleDeleteQuiz = (id) => {
    if (confirm("Delete this quiz?")) dispatch(deleteQuiz(id));
  };

  // --- Question CRUD ---
  const handleQSubmit = async (e) => {
    e.preventDefault();
    setQError("");
    const payload = {
      text: qForm.text,
      options: qForm.options,
      correctAnswerIndex: Number(qForm.correctAnswerIndex),
      keywords: qForm.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    };
    try {
      if (editingQ) {
        await api.put(`/questions/${editingQ._id}`, payload);
        setEditingQ(null);
      } else {
        await api.post("/questions", payload);
      }
      setQForm({ text: "", options: ["", "", "", ""], correctAnswerIndex: 0, keywords: "" });
      loadQuestions();
    } catch (err) {
      setQError(err.response?.data?.message || "Error saving question");
    }
  };

  const handleEditQ = (q) => {
    setEditingQ(q);
    setQForm({
      text: q.text,
      options: [...q.options],
      correctAnswerIndex: q.correctAnswerIndex,
      keywords: (q.keywords || []).join(", "),
    });
  };

  const handleDeleteQ = async (id) => {
    if (!confirm("Delete this question?")) return;
    await api.delete(`/questions/${id}`);
    loadQuestions();
  };

  const handleAddToQuiz = async () => {
    if (!addToQuiz || !selectedQ) return;
    await api.post(`/quizzes/${addToQuiz}/question`, { questionId: selectedQ });
    dispatch(fetchQuizzes());
  };

  // prev: const isMyQuestion = (q) => q.author?._id === user?._id || q.author === user?._id;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Admin Panel</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "quizzes" ? "active" : ""}`}
            onClick={() => setActiveTab("quizzes")}
          >
            Quizzes
            <span className="badge bg-primary ms-2">{quizzes.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
            <span className="badge bg-success ms-2">{questions.length}</span>
          </button>
        </li>
      </ul>

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <div className="row g-4">
          {/* Quiz form */}
          <div className="col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">{editingQuiz ? "Edit Quiz" : "New Quiz"}</h6>
              </div>
              <div className="card-body">
                <form onSubmit={handleQuizSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      placeholder="Quiz title"
                      value={quizForm.title}
                      onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      className="form-control"
                      placeholder="Description"
                      value={quizForm.description}
                      onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" type="submit">
                      {editingQuiz ? "Update" : "Add Quiz"}
                    </button>
                    {editingQuiz && (
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditingQuiz(null); setQuizForm({ title: "", description: "" }); }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <hr />
                <h6>Add Question to Quiz</h6>
                <select className="form-select form-select-sm mb-2" value={addToQuiz} onChange={(e) => setAddToQuiz(e.target.value)}>
                  <option value="">-- Select Quiz --</option>
                  {quizzes.map((q) => <option key={q._id} value={q._id}>{q.title}</option>)}
                </select>
                <select className="form-select form-select-sm mb-2" value={selectedQ} onChange={(e) => setSelectedQ(e.target.value)}>
                  <option value="">-- Select Question --</option>
                  {questions.map((q) => <option key={q._id} value={q._id}>{q.text}</option>)}
                </select>
                <button className="btn btn-success btn-sm" onClick={handleAddToQuiz}>Add to Quiz</button>
              </div>
            </div>
          </div>

          {/* Quiz list */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header">
                <h6 className="mb-0">All Quizzes ({quizzes.length})</h6>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <div className="p-3"><div className="spinner-border spinner-border-sm" /></div>
                ) : quizzes.length === 0 ? (
                  <div className="p-3 text-muted">No quizzes yet.</div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {quizzes.map((q) => (
                      <li key={q._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{q.title}</strong>
                            {q.description && <p className="mb-1 text-muted small">{q.description}</p>}
                            <span className="badge bg-secondary">{q.questions?.length || 0} question(s)</span>
                          </div>
                          <div className="d-flex gap-1 flex-shrink-0 ms-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditQuiz(q)}>Edit</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteQuiz(q._id)}>Delete</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === "questions" && (
        <div className="row g-4">
          {/* Question form */}
          <div className="col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">{editingQ ? "Edit Question" : "New Question"}</h6>
              </div>
              <div className="card-body">
                {qError && <div className="alert alert-danger py-2 small">{qError}</div>}
                <form onSubmit={handleQSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Question</label>
                    <input
                      className="form-control"
                      placeholder="Question text"
                      value={qForm.text}
                      onChange={(e) => setQForm({ ...qForm, text: e.target.value })}
                      required
                    />
                  </div>
                  <label className="form-label">Options</label>
                  {qForm.options.map((opt, i) => (
                    <div key={i} className="mb-2">
                      <input
                        className="form-control form-control-sm"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const opts = [...qForm.options];
                          opts[i] = e.target.value;
                          setQForm({ ...qForm, options: opts });
                        }}
                        required
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="form-label">Correct Answer</label>
                    <select
                      className="form-select form-select-sm"
                      value={qForm.correctAnswerIndex}
                      onChange={(e) => setQForm({ ...qForm, correctAnswerIndex: Number(e.target.value) })}
                    >
                      {qForm.options.map((opt, i) => (
                        <option key={i} value={i}>Option {i + 1}{opt ? `: ${opt}` : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Keywords</label>
                    <input
                      className="form-control form-control-sm"
                      placeholder="comma separated"
                      value={qForm.keywords}
                      onChange={(e) => setQForm({ ...qForm, keywords: e.target.value })}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success" type="submit">
                      {editingQ ? "Update" : "Add Question"}
                    </button>
                    {editingQ && (
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditingQ(null); setQForm({ text: "", options: ["", "", "", ""], correctAnswerIndex: 0, keywords: "" }); }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Question list */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header">
                <h6 className="mb-0">All Questions ({questions.length})</h6>
              </div>
              <div className="card-body p-0">
                {questions.length === 0 ? (
                  <div className="p-3 text-muted">No questions yet.</div>
                ) : (
                  <ul className="list-group list-group-flush" style={{ maxHeight: 600, overflowY: "auto" }}>
                    {questions.map((q) => (
                      <li key={q._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1 me-2">
                            <p className="fw-semibold mb-1">{q.text}</p>
                            <ol className="mb-1 ps-3">
                              {q.options.map((opt, i) => (
                                <li key={i} className={i === q.correctAnswerIndex ? "text-success fw-semibold" : "text-muted"}>
                                  <small>{opt}{i === q.correctAnswerIndex && " ✓"}</small>
                                </li>
                              ))}
                            </ol>
                            {/* prev: showed author + "you" badge + read-only for non-authors
                            <small className="text-secondary">
                              By: <span className="fw-medium">{q.author?.username || "unknown"}</span>
                              {isMyQuestion(q) && <span className="badge bg-info text-dark ms-1">you</span>}
                            </small>
                            */}
                          </div>
                          <div className="d-flex flex-column gap-1 flex-shrink-0">
                            {/* prev: only showed buttons if isMyQuestion(q), else showed read-only badge */}
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditQ(q)}>Edit</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteQ(q._id)}>Delete</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
