import "./App.css";
import { lazy, Suspense, useCallback, useState } from "react";
import FormField, { type TextFieldName } from "./components/FormField";

const RegistrationSummary = lazy(
  () => import("./components/RegistrationSummary"),
);

type RegistrationData = {
  fullName: string;
  email: string;
  experienceLevel: string;
  learningGoal: string;
};

type FieldErrors = Partial<Record<keyof RegistrationData, string>>;
type Step = 1 | 2 | 3;

const initialFormData: RegistrationData = {
  fullName: "",
  email: "",
  experienceLevel: "",
  learningGoal: "",
};

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<RegistrationData>(initialFormData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = useCallback(
    (name: keyof RegistrationData, value: string) => {
      setFormData((current) => ({ ...current, [name]: value }));
      setErrors((current) => {
        if (!current[name]) return current;
        const next = { ...current };
        delete next[name];
        return next;
      });
    },
    [],
  );

  const validateStep = useCallback(
    (stepToValidate: Step): boolean => {
      const nextErrors: FieldErrors = {};
      if (stepToValidate === 1) {
        if (formData.fullName.trim().length < 2) {
          nextErrors.fullName =
            "Enter your valid Full name (at least 2 characters long)";
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email.trim())) {
          nextErrors.email = "Enter a valid email address.";
        }
      }
      if (stepToValidate === 2) {
        if (!formData.experienceLevel.trim()) {
          nextErrors.experienceLevel = "Enter your experience level";
        }

        if (formData.learningGoal.trim().length < 12) {
          nextErrors.learningGoal =
            "Submit at least 12 characters for learning goals";
        }
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    },
    [formData],
  );

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      if (validateStep(1)) setStep(2);
      return;
    }
    if (step === 2) {
      if (validateStep(2)) setStep(3);
      return;
    }
    setSubmitted(true);
  }

  function handleBack() {
    if (step === 3) setStep(2);
    if (step === 2) setStep(1);
  }

  function handleStartOver() {
    setStep(1);
    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
  }

  const progress = (step / 3) * 100;

  if (submitted) {
    return (
      <main className="page-shell">
        <section className="success-card" aria-labelledby="success-title">
          <p className="eyebrow">REGISTRATION COMPLETE</p>
          <h1 id="success-title">Thanks, {formData.fullName}!</h1>
          <p>
            Your demo registration has been submitted. A real application would
            send these details to its backend here.
          </p>
          <button type="button" onClick={handleStartOver}>
            Start a new registration
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">WORKSHOP SIGN-UP</p>
        <h1>Registration Wizard</h1>
        <p>Complete three short steps to register for the workshop.</p>
      </header>

      <section className="form-card" aria-labelledby="step-title">
        <div className="progress-heading">
          <span>Step {step} of 3</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Registration progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <form noValidate onSubmit={handleSubmit}>
          {step === 1 && (
            <section className="step-content">
              <h2 id="step-title">Your details</h2>
              <p className="muted">
                First, tell us how to identify and contact you.
              </p>

              <FormField
                name="fullName"
                label="Full name"
                type="text"
                value={formData.fullName}
                error={errors.fullName}
                placeholder="e.g. Alex Morgan"
                autoComplete="name"
                onValueChange={updateField}
              />
              <FormField
                name="email"
                label="Email address"
                type="email"
                value={formData.email}
                error={errors.email}
                placeholder="alex@example.com"
                autoComplete="email"
                onValueChange={updateField}
              />
            </section>
          )}

          {step === 2 && (
            <section className="step-content">
              <h2 id="step-title">Your learning goals</h2>
              <p className="muted">
                Help us understand your current level and goal.
              </p>

              <div className="form-field">
                <label htmlFor="experienceLevel">Experience level</label>
                <select
                  id="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={(event) =>
                    updateField("experienceLevel", event.target.value)
                  }
                  aria-invalid={Boolean(errors.experienceLevel)}
                  aria-describedby={
                    errors.experienceLevel ? "experienceLevel-error" : undefined
                  }
                >
                  <option value="">Choose an option</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {errors.experienceLevel && (
                  <p
                    className="field-error"
                    id="experienceLevel-error"
                    role="alert"
                  >
                    {errors.experienceLevel}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="learningGoal">What do you want to learn?</label>
                <textarea
                  id="learningGoal"
                  rows={4}
                  value={formData.learningGoal}
                  onChange={(event) =>
                    updateField("learningGoal", event.target.value)
                  }
                  placeholder="Describe one or two things you want to learn..."
                  aria-invalid={Boolean(errors.learningGoal)}
                  aria-describedby={
                    errors.learningGoal ? "learningGoal-error" : undefined
                  }
                />
                {errors.learningGoal && (
                  <p
                    className="field-error"
                    id="learningGoal-error"
                    role="alert"
                  >
                    {errors.learningGoal}
                  </p>
                )}
                <p className="field-hint">Use at least 15 characters.</p>
              </div>
            </section>
          )}

          {step === 3 && (
            <Suspense
              fallback={
                <p className="loading-message" role="status">
                  Loading your review…
                </p>
              }
            >
              <RegistrationSummary data={formData} />
            </Suspense>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button
                className="button-secondary"
                type="button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            <button className="button-primary" type="submit">
              {step === 1
                ? "Continue"
                : step === 2
                  ? "Review details"
                  : "Submit registration"}
            </button>
          </div>
        </form>
      </section>
      <p className="page-footnote">
        Practice project: data is held in React state and is not sent to a
        server.
      </p>
    </main>
  );
}
