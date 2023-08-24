import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import NumberOnline from "@/components/NumberOnline";
export default function Landing() {
  return (
    <>
      <main
        className="main-container flex flex-col items-center justify-between 
        p-4 text-ink text-center"
        // style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* TODO: need to have some sort of loading state */}
        <div className="grow flex flex-col items-center justify-center">
          <div className="title-container relative flex items-center justify-center px-4">
            <img
              // width="100%"
              // height="auto"
              src="/images/tomato.png"
              alt="watercolor illustration of a tomato"
              className="absolute z-10 landing-tomato"
            />
            <h1 className="landing-name z-20">
              <span>pomo</span>
              <span>.chat</span>
            </h1>
          </div>
          <div className="subtitle-container mt-4 md:mt-20 mb-4 text-center">
            <p>a social pomodoro timer</p>
            <p>25 minutes of focus · 5 minutes of chat</p>
          </div>
          <Link
            href="/timer"
            className="bg-ink text-cream rounded-full px-10 py-4 my-4
            hover:bg-tomato transition-all w-full max-w-[200px]"
          >
            enter
          </Link>
          <NumberOnline />
        </div>
        <Footer />
      </main>
    </>
  );
}
