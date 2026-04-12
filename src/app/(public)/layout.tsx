import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>

      <Footer />
    </div>
  );
};

export default PublicLayout;
