type StudentCardProps = {
  name: string;
  role: string;
};

function StudentCard({ name, role }: StudentCardProps) {
  return (
    <section className="card">
      <h2 className="card__name">{name}</h2>
      <p className="card__role">{role}</p>
    </section>
  );
}

export default StudentCard;
