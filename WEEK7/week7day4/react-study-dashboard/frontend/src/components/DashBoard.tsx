import React, { useCallback, useMemo, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { addSession, removeSession } from "../features/study/studySlice";
import { useStudySessions } from "../hooks/useStudySessions";
import StudyChart from "./StudyChart";

const DashBoard = () => {
  const dispatch = useAppDispatch();
  const { sessions, loading, error, retry } = useStudySessions();
  const [topic, setTopic] = useState("");
  const [hours, setHours] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);

  const chartData = useMemo(() => {
    const totals = new Map<string, number>();

    for (const session of sessions) {
      totals.set(
        session.topic,
        (totals.get(session.topic) ?? 0) + session.hours,
      );
    }

    return Array.from(totals, ([topicName, totalHours]) => ({
      topic: topicName,
      hours: Number(totalHours.toFixed(2)),
    }));
  }, [sessions]);

  const totalHours = useMemo(() => {
    return sessions.reduce((sum, session) => sum + session.hours, 0);
  }, [sessions]);

  const handleSubmit = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      const cleanTopic = topic.trim();
      const parsedHours = Number(hours);

      if (!cleanTopic) {
        setFormError(`Enter as topic name`);
        return;
      }

      if (
        !Number.isFinite(parsedHours) ||
        parsedHours <= 0 ||
        parsedHours > 24
      ) {
        setFormError(`Hours must be greater than 0 and no more than 24`);
        return;
      }

      dispatch(
        addSession({
          id: crypto.randomUUID(),
          topic: cleanTopic,
          hours: parsedHours,
          date: new Date().toISOString().slice(0, 10),
        }),
      );
      setTopic(``);
      setHours("1");
      setFormError(null);
    },
    [dispatch, topic, hours],
  );

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeSession(id));
    },
    [dispatch],
  );

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">LEARNING TRACKER</p>
        <h1>Study Time DashBoard</h1>
        <p className="muted">Track a little progress, one session at a time</p>
      </header>

      <section className="panel">
        <h2>Add study session</h2>
        <form className="session-form" onSubmit={handleSubmit}>
          <label>
            Topic
            <input
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. React Hooks"
            />
          </label>

          <label>
            Hours
            <input
              type="number"
              min="0.25"
              max="24"
              step="0.25"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              placeholder="e.g. 2"
            />
          </label>

          <button type="submit">Add session</button>
        </form>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
      </section>

      {loading && <p className="panel">Loading sample sessions...</p>}
      {error && (
        <div className="error-banner" role="alert">
          <p>{error}</p>
          <button type="button" onClick={retry}>
            Retry
          </button>
        </div>
      )}

      <section className="summary-grid">
        <article className="summary-card">
          <span className="muted">Sessions</span>
          <strong>{sessions.length}</strong>
        </article>
        <article className="summary-card">
          <span className="muted">Total study hours</span>
          <strong>{totalHours.toFixed(2)}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Study hours by topic</h2>
        <StudyChart data={chartData} />
      </section>

      <section className="panel">
        <h2>Study sessions</h2>
        {sessions.length === 0 ? (
          <p className="muted">No sessions yet. Add one above</p>
        ) : (
          <ul className="session-list">
            {sessions.map((session) => {
              return (
                <li key={session.id} className="session-row">
                  <div>
                    <strong>{session.topic}</strong>
                    <span className="muted session-date">{session.date}</span>
                  </div>
                  <div className="session-actions">
                    <span>{session.hours} h</span>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemove(session.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
};

export default DashBoard;
