import NumberOnline from "./NumberOnline";
interface Props {
  nameField: string;
  setNameField: (nameField: string) => void;
  setName: (name: string) => void;
  setAppOpen: (appOpen: boolean) => void;
}
const Landing: React.FC<Props> = ({
  nameField,
  setNameField,
  setName,
  setAppOpen,
}) => {
  const handleNameKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && nameField.length > 0) {
      submitName();
    }
  };

  const submitName = () => {
    setName(nameField);
    setAppOpen(true);
    localStorage.setItem("name", nameField);
  };

  return (
    <>
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
        <div className="nameinput-container max-w-[300px]">
          <input
            type="text"
            placeholder="give yourself a name"
            value={nameField}
            className="w-full p-4 outline outline-ink
             focus:outline-2
                  
                    text-ink w-full bg-transparent rounded-xl"
            onChange={(e) => setNameField(e.target.value)}
            onKeyUp={handleNameKeypress}
          />
          <button
            onClick={submitName}
            className="bg-ink text-cream rounded-full px-10 py-4 my-4
            hover:bg-tomato transition-all w-full"
          >
            enter
          </button>
        </div>

        <NumberOnline />
      </div>
    </>
  );
};

export default Landing;
