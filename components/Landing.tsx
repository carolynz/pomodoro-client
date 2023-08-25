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
        <div className="subtitle-container mb-4 text-center">
          <p>a social pomodoro timer</p>
          <p>25 minutes of focus · 5 minutes of chat</p>
        </div>
        <div className="nameinput-container relative max-w-[300px]">
          <input
            type="text"
            placeholder="name"
            value={nameField}
            className="w-full py-16 pt-32 outline outline-ink
             focus:outline-4 placeholder:text-ink/30
             text-ink text-4xl text-center font-thin bg-transparent rounded-3xl"
            onChange={(e) => setNameField(e.target.value)}
            onKeyUp={handleNameKeypress}
          />
          <div
            className="absolute top-0 w-full
          flex items-center justify-center
          p-6 bg-tomato text-cream rounded-tr-3xl rounded-tl-3xl"
          >
            hi~ my name is
          </div>

          <button
            onClick={submitName}
            className="bg-ink outline outline-ink text-cream rounded-full px-10 py-4 my-4
            hover:bg-tomato transition-all w-full"
          >
            enter
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing;
