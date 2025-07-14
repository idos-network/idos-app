import { useEffect, useRef } from 'react';
import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import { DownloadIcon } from '@/components/icons/download';
import SmallCopyButton from '@/components/SmallCopyButton';
import { CloseIcon } from '@/components/icons/close';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  downloadData?: {
    content: string;
    filename: string;
  };
  loading?: boolean;
}

export function CredentialDetailsModal({
  isOpen,
  onClose,
  children,
  downloadData,
  loading = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      {loading ? (
        <div className="flex items-center justify-center">{children}</div>
      ) : (
        <div
          ref={modalRef}
          className="relative w-full flex max-w-2xl max-h-[80vh] rounded-2xl bg-neutral-950"
        >
          <div className="flex flex-col border-neutral-800 bg-neutral-800/60 overflow-hidden gap-8 p-6 rounded-2xl border">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-normal text-neutral-50">
                Credential Details
              </h2>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-neutral-200 hover:bg-idos-grey2"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto rounded-lg max-h-[calc(80vh-180px)]">
              {children}
            </div>

            {/* Footer with download button */}
            {downloadData && (
              <div className="flex justify-end gap-3">
                <SmallCopyButton content={downloadData.content} />
                <SmallPrimaryButton
                  onClick={() => {
                    const blob = new Blob([downloadData.content], {
                      type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = downloadData.filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  icon={<DownloadIcon className="w-4 h-4" />}
                  disabled={!downloadData.content}
                >
                  Download as .json
                </SmallPrimaryButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
