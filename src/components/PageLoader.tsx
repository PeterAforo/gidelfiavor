import { Loader2 } from "lucide-react";

const PageLoader = () => (
  <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </main>
);

export default PageLoader;
