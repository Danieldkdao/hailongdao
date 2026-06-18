import { Footer } from "@/components/app/footer";
import { Header } from "@/components/app/header";
import { PasswordRequiredModal } from "@/features/passwords/components/password-required-modal";
import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <PasswordRequiredModal />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
