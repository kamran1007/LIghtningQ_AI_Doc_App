export default function PageWrapper({ children }: { children: React.ReactNode   }) {
  return (
    <div className="custom-scrollbar h-screen overflow-y-auto">
      {children}
    </div>
  );
}
