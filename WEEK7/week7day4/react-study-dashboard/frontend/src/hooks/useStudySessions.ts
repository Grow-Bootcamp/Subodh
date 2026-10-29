import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setLoadError,
  setLoading,
  setSessions,
  type StudySession,
} from "../features/study/studySlice";

export function useStudySession() {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector((state) => state.study.sessions);
  const loading = useAppSelector((state) => state.study.loading);
  const error = useAppSelector((state) => state.study.error);
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSessions() {
      dispatch(setLoading());
      try {
        const response = await fetch(
          "http://localhost:4000/api/study-sessions",
          {
            signal: controller.signal,
          },
        );
        if (!response.ok)
          throw new Error(`Response failed with ${response.status}`);
        const sessions = (await response.json()) as StudySession[];
        dispatch(setSessions(sessions));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        dispatch(
          setLoadError(
            "Couldnot load sessions. Check that the server is running",
          ),
        );
      }
    }

    void loadSessions();
    return () => controller.abort();
  }, [dispatch, reloadKey]);

  return { sessions, loading, error, retry };
}
