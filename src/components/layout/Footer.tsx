export default function Footer() {
  return (
    <footer className="mt-auto  justify-evenly flex gap-4 items-center h-13 pb-4 pt-4 border-t border-gray-800 -mx-6 px-4">
      <div className=" p-4">
        <a
          href="https://www.idos.network/legal/user-agreement"
          target="_blank"
          rel="noopener noreferrer"
        >
          User Agreement
        </a>
      </div>

      <div className=" p-4">
        <a
          href="http://www.idos.network/legal/transparency-document"
          target="_blank"
          rel="noopener noreferrer"
        >
          Transparency Document
        </a>
      </div>

      <div className=" p-4">
        <a
          href="http://www.idos.network/legal/data-protection"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data Protection
        </a>
      </div>

      <div className=" p-4">
        <a
          href="https://www.idos.network/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
