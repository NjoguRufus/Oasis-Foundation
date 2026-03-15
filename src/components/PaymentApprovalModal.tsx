import React, { useEffect, useCallback } from "react";

const GOOGLE = {
  blue: "#4285F4",
  green: "#34A853",
  yellow: "#FBBC05",
  red: "#EA4335",
  white: "#FFFFFF",
  border: "#DADCE0",
  overlay: "rgba(0, 0, 0, 0.45)",
} as const;

export type PaymentApprovalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientName?: string;
  amount?: number;
  oldPlan?: string;
  newPlan?: string;
  orgName?: string;
  logoSrc?: string;
};

function formatAmount(n: number): string {
  return n.toLocaleString("en-KE");
}

export const PaymentApprovalModal: React.FC<PaymentApprovalModalProps> = ({
  isOpen,
  onClose,
  clientName = "Astraronix Solutions",
  amount = 5695,
  oldPlan = "Fixed Name Plan",
  newPlan = "Dynamic Name Plan",
  orgName = "Oasis Wellness Foundation",
  logoSrc = "/images/approva.png",
}) => {
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bodyText = `Dear Client ${clientName}, your bill for KES ${formatAmount(amount)}/= has been approved, and ${orgName} has moved from a ${oldPlan} to a ${newPlan}.`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-approval-heading"
      aria-describedby="payment-approval-body"
    >
      {/* Overlay — fades in */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ backgroundColor: GOOGLE.overlay }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal — sharp corners, no rounded */}
      <div
        className="relative w-full max-w-md bg-white shadow-lg transition-all duration-200 ease-out animate-approval-in"
        style={{
          border: `1px solid ${GOOGLE.border}`,
          borderRadius: 0,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar — success green */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ backgroundColor: GOOGLE.green }}
        />

        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="mb-5 flex justify-center">
            <img
              src={logoSrc}
              alt=""
              className="h-12 w-auto object-contain sm:h-14"
              style={{ borderRadius: 0 }}
              width={56}
              height={48}
            />
          </div>

          {/* Heading */}
          <h2
            id="payment-approval-heading"
            className="mb-3 text-center text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl"
            style={{ color: "#202124" }}
          >
            Payment Approved
          </h2>

          {/* Body */}
          <p
            id="payment-approval-body"
            className="mb-6 text-left text-sm leading-relaxed text-gray-700 sm:text-base"
          >
            {bodyText}
          </p>

          {/* Dismiss button — sharp, primary */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white"
              style={{
                backgroundColor: GOOGLE.blue,
                borderRadius: 0,
                minWidth: 140,
              }}
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Bottom accent (optional subtle line) */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: GOOGLE.border }}
        />
      </div>
    </div>
  );
};

export default PaymentApprovalModal;
