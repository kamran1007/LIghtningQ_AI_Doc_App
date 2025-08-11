export default function PageWrapper({ children }) {
  return (
    <div className="custom-scrollbar h-screen overflow-y-auto">
      {children}
    </div>
  );
}
