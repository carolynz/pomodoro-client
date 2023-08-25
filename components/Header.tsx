import NumberOnline from "./NumberOnline";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold text-ink">pomo.chat</div>
        <NumberOnline />
        {children}
      </div>
    </>
  );
}
