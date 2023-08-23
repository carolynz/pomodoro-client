export default function Footer() {
  return (
    <>
      <div className="flex flex-col items-center xs:flex-row text-sm">
        <p>
          made by{" "}
          <a
            href="https://www.tiktok.com/@kelin.online"
            target="_blank"
            className="font-semibold hover:underline"
          >
            kelin
          </a>
        </p>
        <p>
          <span className="hidden xs:inline-block mx-1">·</span>support my work
          by{" "}
          <a
            href="https://www.buymeacoffee.com/kelin"
            target="_blank"
            className="font-semibold hover:underline"
          >
            buying me a coffee
          </a>
        </p>
      </div>
    </>
  );
}
