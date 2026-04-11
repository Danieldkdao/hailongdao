import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-full">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
