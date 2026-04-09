import Link from "next/link";
import { ReactNode } from "react";

const navbarLinks = [
  { label: "Research", href: "#research" },
  { label: "Teaching/Mentoring", href: "#teaching" },
  { label: "Math Activities", href: "#activities" },
  { label: "Personal", href: "#personal" },
];

const researchSectionLinks = [
  {
    label: "MyCV (updated 2025)",
    href: "/documents/DaoCV.pdf",
  },
  {
    label: "arXiv Profile",
    href: "https://arxiv.org/search/?query=Hailong+Dao&searchtype=author",
  },
  {
    label: "Google Scholar Profile",
    href: "https://scholar.google.com/citations?user=dM5ZgaIAAAAJ&hl=en",
  },
  {
    label: "Math Zentralblatt zbMATH Profile",
    href: "https://zbmath.org/authors/dao.hailong",
  },
];

const formerPostdocs = [
  {
    label: "Olgur Celikbas",
    href: "https://mathanddata.wvu.edu/directory/faculty/olgur-celikbas",
  },
  {
    label: "Jay Schweig",
    href: "https://experts.okstate.edu/jay.schweig",
  },
  {
    label: "Jonathan Montaño",
    href: "https://j-montano.github.io/",
  },
  {
    label: "Kyle Maddox",
    href: "https://sites.google.com/view/kylemaddox/home",
  },
];

const HomePage = () => {
  return (
    <div className="w-full space-y-4">
      <div className="w-full">
        <div className="w-full py-5 bg-primary flex flex-col items-center gap-2">
          <h1 className="text-[2.5em] font-bold text-primary-foreground">
            Hailong Dao
          </h1>
          <span className="text-primary-foreground text-xl font-[525] pb-2">
            Professor of Mathematics, University of Kansas
          </span>
        </div>
        <div className="flex items-center gap-8 py-2.5 justify-center bg-secondary">
          {navbarLinks.map((n) => (
            <Link
              href={n.href}
              key={n.href}
              className="text-secondary-foreground text-lg font-[525]"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-5">
        <div className="w-full py-10 px-5 shadow-[0_0px_8px_rgba(0,0,0,0.15)] max-w-235 bg-card flex flex-col gap-6 mx-4">
          <div className="flex flex-col gap-1" id="research">
            <h2 className="text-2xl font-extrabold text-primary">Research</h2>
            <hr className="border border-primary" />
            <p className="mt-5">
              My research focuses on many facets of{" "}
              <CustomLink href="https://www.commalg.org">
                commutative algebra
              </CustomLink>{" "}
              and it's connections to other areas such as{" "}
              <CustomLink href="https://en.wikipedia.org/wiki/Algebraic_geometry">
                algebraic geometry
              </CustomLink>
              ,{" "}
              <CustomLink href="https://en.wikipedia.org/wiki/Category_theory">
                category theory
              </CustomLink>
              , and{" "}
              <CustomLink href="https://en.wikipedia.org/wiki/Combinatorics">
                combinatorics
              </CustomLink>
              . Below are links to my CV and various research profiles:
            </p>
            <div className="flex flex-col gap-3 mt-4">
              {researchSectionLinks.map((link) => (
                <CustomLink href={link.href} key={link.href}>
                  {link.label}
                </CustomLink>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1" id="teaching">
            <h2 className="text-2xl font-extrabold text-primary">
              Teaching/Mentoring
            </h2>
            <hr className="border border-primary" />
            <p className="text-base mt-4 mb-4">
              I truly enjoy mentoring students and working with young people in
              general. Their ideas, energy and hard work have inspired me so
              much over the years. The majority of my collaborators were
              students or postdocs at the time, most were not even at KU (see
              Collaborators page above). Below are the more "official" ones:
            </p>
            <div className="flex flex-col gap-3">
              <h4 className="text-base font-black text-primary">
                Former PhD Students:
              </h4>
              <CustomLink href="https://www.genealogy.math.ndsu.nodak.edu/id.php?id=115401&fChrono=1">
                My Academic Genealogy
              </CustomLink>
              <span className="text-base">
                Three recently graduated PhD (not yet on the genealogy page):{" "}
                <CustomLink href="https://sites.google.com/view/souvikdey/research">
                  Souvik Dey
                </CustomLink>
                ,{" "}
                <CustomLink href="https://sites.google.com/view/ritika-nair/home">
                  Ritika Nair
                </CustomLink>
                ,{" "}
                <CustomLink href="https://www.linkedin.com/in/monalisa-dutta-356b77260/">
                  Monalisa Dutta
                </CustomLink>
              </span>
              <span className="text-base font-black text-primary">
                Current PhD Students:{" "}
                <CustomLink href="https://sreehari183.github.io/">
                  Sreehari Suresh-Babu
                </CustomLink>
              </span>
              <h4 className="text-base font-black text-primary">
                Former Postdocs (not officially mine, but who worked closely
                with me during their time at KU):
              </h4>
              <div className="flex flex-col gap-3">
                {formerPostdocs.map((postdoc) => (
                  <CustomLink href={postdoc.href} key={postdoc.href}>
                    {postdoc.label}
                  </CustomLink>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1" id="activities">
            <h2 className="text-2xl font-extrabold text-primary">
              Math Related Activities
            </h2>
            <hr className="border border-primary" />
            <div className="flex flex-col gap-2">
              <p className="text-base mt-4 mb-2">
                The community of math lovers is large, diverse and extremely
                fascinating, with thousand of years of history. I am lucky to be
                an active member of this community.
              </p>
              <span className="text-base font-black text-primary">
                MathOverflow:{" "}
                <CustomLink href="https://mathoverflow.net/users/2083/hailong-dao">
                  Profile
                </CustomLink>{" "}
                -{" "}
                <span className="text-base font-normal text-foreground">
                  A fan and member of this site from the very beginning, I have
                  asked and answered hundreds of questions in commutative
                  algebra and related fields.
                </span>
              </span>
              <span className="text-base font-black text-primary">
                Editorship:{" "}
                <span className="text-base font-normal text-foreground">
                  I am currently serving as an Editor for{" "}
                  <CustomLink href="https://bkms.kms.or.kr/content/about/aimsnscope.html">
                    Bulletin of the Korean Math Society
                  </CustomLink>
                  .
                </span>
              </span>
              <span className="text-base font-black text-primary">
                IMO:{" "}
                <span className="text-base font-normal text-foreground">
                  I have been involved in many aspects of the{" "}
                  <CustomLink href="https://www.imo-official.org/">
                    International Mathematical Olympiad (IMO)
                  </CustomLink>
                  : as competitor, grader, organizer.
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1" id="personal">
            <h2 className="text-2xl font-extrabold text-primary">Personal</h2>
            <hr className="border border-primary" />
            <p className="text-base mt-4">
              Outside of mathematics, I enjoy spending time with my family,
              travelling, and reading. We have two lovely and active boys who
              keep us busy and humbled.
            </p>
          </div>
        </div>
        <footer className="py-10 bg-primary flex items-center justify-center w-full">
          <span className="text-center text-base font-[525] text-primary-foreground">
            © 2025 Hailong Dao. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
};

const CustomLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="text-accent hover:underline font-normal"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

export default HomePage;
