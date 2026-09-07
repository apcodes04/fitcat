import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] flex flex-col items-center justify-center space-y-4 p-4 text-center">
      <Logo className="h-16 w-auto" />
      <h2 className="text-xl font-bold text-[#E5C158]">Page Not Found</h2>
      <p className="text-xs text-[#9A978F] max-w-xs">The requested page could not be found.</p>
      <a
        href="/"
        className="bg-[#05c92f] text-[#0f110f] font-bold text-xs px-5 py-2.5 rounded-full shadow hover:bg-[#3ade5c] transition"
      >
        Back to Home
      </a>
    </div>
  );
}
