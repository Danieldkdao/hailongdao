import Link from "next/link";

const AboutPage = () => {
  const qas = [
    {
      question: "What is this site?",
      answer: (
        <p className="text-muted-foreground">
          This is a curated collection of "fun" problems in commutative algebra.
          By that, we mean the statement should be short, understood by most
          graduate students in the field, and easy to formalize, so even the AI
          models can enjoy them. The solutions (if they exist) should require
          some real efforts or creativity.
        </p>
      ),
    },
    {
      question: "Who should use the site?",
      answer: (
        <p className="text-muted-foreground">
          Anyone who want to have fun thinking about commutative algebra. Or
          want to train their AI models (who, by 2026, have been quite mediocre
          at the subject). That's why we provide no solutions (even for the
          solved ones).
        </p>
      ),
    },
    {
      question: "What do the rating and status mean?",
      answer: (
        <p className="text-muted-foreground">
          Roughly, 1 and 2 stars mean graduate level exercises (and can probably
          be solved by 2026 Pro AI models). 3 stars and higher mean something
          that can be a useful part of a research paper, or a whole paper on its
          own. For status, "open" means "open as far as the original proposer
          knows" and similarly for other statuses.
        </p>
      ),
    },
    {
      question: "Can I comment?",
      answer: (
        <p className="text-muted-foreground">
          Yes! And we would love to hear from you, especially when it concerns
          originality, correctness, or updates on the problems. The comment box
          is open for anyone and supports basic latex and hyperlinks. See here
          for details:{" "}
          <Link
            href="https://katex.org"
            target="_blank"
            className="text-foreground"
          >
            https://katex.org
          </Link>
        </p>
      ),
    },
    {
      question: "Who are you?",
      answer: (
        <p className="text-muted-foreground">
          The initial idea, problems, and coding works come from the team of{" "}
          <Link
            href="https://hailongdao.github.io"
            target="_blank"
            className="text-foreground"
          >
            Hailong Dao
          </Link>
          , Daniel Dao and Lawrence Dao. But we hope to attract mathematical
          contributions from the whole community in the long run.
        </p>
      ),
    },
  ];

  return (
    <div className="w-full py-10 px-6 flex items-center justify-center">
      <div className="bg-card/50 border p-5 w-full max-w-5xl space-y-4">
        <div className="space-y-4 pt-2">
          {qas.map((qa) => (
            <div key={qa.question} className="space-y-1">
              <h2 className="text-lg font-semibold">{qa.question}</h2>
              {qa.answer}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
