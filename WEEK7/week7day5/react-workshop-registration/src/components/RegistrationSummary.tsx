type RegistrationData = {
  fullName: string;
  email: string;
  experienceLevel: string;
  learningGoal: string;
};

type RegistrationSummaryProps = {
  data: RegistrationData;
};

const experienceLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function RegistratonSummary({ data }: RegistrationSummaryProps) {
  return (
    <section className="review-card" aria-labelledby="review-title">
      <h2 id="review-title">Review your registration</h2>
      <p>Check your details before submittings</p>

      <dl className="review-list">
        <div>
          <dt>Full name</dt>
          <dd>{data.fullName}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{data.email}</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>
            {experienceLabels[data.experienceLevel] ?? data.experienceLevel}
          </dd>
        </div>
        <div>
          <dt>Learning goal</dt>
          <dd>{data.learningGoal}</dd>
        </div>
      </dl>
    </section>
  );
}
