import Link from "next/link";

const AboutPage = () => {
  const qas = [
    {
      question: "What is this site?",
      answer:
        'This is a curated collection of "fun" problems in commutative algebra. By that, we meant the statement should be short, understood by most graduate students in the field, and easy to formalize, so even the AI models can enjoy them. The solutions (if they exist) typically required some real efforts or creativity.',
    },
    {
      question: "Who should use the site?",
      answer:
        "Anyone who want to have fun thinking about commutative algebra. Or want to train their AI models (who, by 2026, have been quite mediocre at the subject). That's why we provide no solutions (even for the solved ones).",
    },
    {
      question: "What does the rating mean?",
      answer:
        "Roughly, 1 and 2 stars mean graduate level exercises (and can probably be solved by 2026 Pro AI models). 3 stars and higher means something that can be a useful part of a research paper, or a whole paper on its own.",
    },
    {
      question: "Who are you?",
      answer:
        "The initial idea and coding works come from the team of Hailong Dao, Daniel Dao and Lawrence Dao. But we hope to attract mathematical contributions from the whole community in the long run.",
    },
    {
      question: "Can I comment?",
      answer:
        "Yes! And we encourage you to do so! The comment box is open for anyone and supports basic latex. See here for details: ",
      link: "https://katex.org",
    },
  ];

  return (
    <div className="w-full py-10 px-6 flex items-center justify-center">
      <div className="bg-card/50 border p-5 w-full max-w-5xl space-y-4">
        <div className="space-y-4 pt-2">
          {qas.map((qa) => (
            <div key={qa.question} className="space-y-1">
              <h2 className="text-lg font-semibold">{qa.question}</h2>
              <div>
                <span className="text-muted-foreground">{qa.answer}</span>
                {qa.link && <Link href={qa.link}>{qa.link}</Link>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
