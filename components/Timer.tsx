import Image from "next/image";

interface Props {
  minutes: string; //double-digit padded minutes countdown
  seconds: string; //double-digit padded second countdown
}
const TimerPage: React.FC<Props> = ({ minutes, seconds }) => {
  return (
    <>
      <div className="timer-container justify-center items-center w-full align-center text-ink">
        <div className="time text-center num-monospace">{minutes}</div>
        <div className="tomato w-full flex justify-center">
          {/* <img
            width="100%"
            height="auto"
            src="/images/tomato.png"
            alt="watercolor illustration of a tomato"
          /> */}
          <Image
            width={300} // will be overridden by css
            height={300} //will be overridden by css
            className="w-auto h-auto"
            src="/images/tomato.png"
            alt="watercolor illustration of a tomato"
          />
        </div>
        <div className="time text-center num-monospace">{seconds}</div>
      </div>
    </>
  );
};
export default TimerPage;
