import NumberOnline from "./NumberOnline";

interface Props {
  appOpen: boolean;
  chatOpen: boolean;
  minutes: string;
  seconds: string;
}

const Header: React.FC<Props> = ({ appOpen, chatOpen, minutes, seconds }) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold text-ink">pomo.chat</div>
        <div className="flex flex-row text-sm">
          <NumberOnline />
          {appOpen && chatOpen && (
            <>
              <span className="mx-1">·</span>
              <span className="num-monospace">
                Chat closes in {minutes}:{seconds}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
