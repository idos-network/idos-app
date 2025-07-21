import CloseIcon from './icons/close';

export default function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="rounded-md p-2 cursor-pointer text-neutral-200 hover:bg-idos-grey2"
    >
      <CloseIcon className="w-3 h-3" />
    </button>
  );
}
