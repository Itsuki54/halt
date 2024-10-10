export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div
        className="absolute inset-0 bg-black opacity-70 z-0"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
