"use client";
import React, { useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type ModalPosition = "center" | "top" | "bottom" | "drawer-right" | "drawer-left";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;

  // Layout
  size?: ModalSize;
  position?: ModalPosition;
  className?: string;

  // Behavior
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;

  // UI Controls
  showCloseButton?: boolean;

  // Accessibility
  title?: string;
  description?: string;

  // Callbacks
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
}

const sizeClasses: Record<ModalSize, string> = {
  sm:    "w-full max-w-sm",
  md:    "w-full max-w-md",
  lg:    "w-full max-w-[768px]",
  xl:    "w-full max-w-[960px]",
  "2xl": "w-full max-w-[1200px]",
  full:  "w-full h-full max-w-none rounded-none",
};

const positionClasses: Record<ModalPosition, string> = {
  center: "items-center justify-center",
  top: "items-start justify-center pt-16",
  bottom: "items-end justify-center pb-8",
  "drawer-right": "items-stretch justify-end",
  "drawer-left": "items-stretch justify-start",
};

const drawerContentClasses: Record<ModalPosition, string> = {
  center: "",
  top: "",
  bottom: "",
  "drawer-right": "h-full rounded-none rounded-l-3xl max-w-sm",
  "drawer-left": "h-full rounded-none rounded-r-3xl max-w-sm",
};

const positionEnterAnimation: Record<ModalPosition, string> = {
  center: "modal-enter-center",
  top: "modal-enter-top",
  bottom: "modal-enter-bottom",
  "drawer-right": "modal-enter-right",
  "drawer-left": "modal-enter-left",
};

export const ModalV2: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  position = "center",
  className = "",
  closeOnBackdrop = true,
  closeOnEscape = true,
  preventScroll = true,
  showCloseButton = true,
  title,
  description,
  onAfterOpen,
  onAfterClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const isDrawer = position === "drawer-right" || position === "drawer-left";
  const isFull = size === "full";

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Escape key
  useEffect(() => {
    if (!closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, handleClose]);

  // Scroll lock
  useEffect(() => {
    if (!preventScroll) return;
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, preventScroll]);

  // Focus trap & callbacks
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const focusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      });
      onAfterOpen?.();
    } else {
      previousFocusRef.current?.focus();
      onAfterClose?.();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus trap tab key
  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (typeof window === "undefined") return null;
  if (!isOpen) return null;

  const isRoundedFull = isFull || isDrawer;

  const contentClasses = [
    "relative bg-white dark:bg-gray-900 shadow-2xl",
    !isRoundedFull && "rounded-3xl",
    drawerContentClasses[position],
    !isDrawer && !isFull && sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <>
      <style>{`
        @keyframes modal-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-center-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modal-top-in {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modal-bottom-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modal-right-in {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes modal-left-in {
          from { opacity: 0; transform: translateX(-100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .modal-backdrop { animation: modal-backdrop-in 0.2s ease forwards; }
        .modal-enter-center { animation: modal-center-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .modal-enter-top    { animation: modal-top-in    0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .modal-enter-bottom { animation: modal-bottom-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .modal-enter-right  { animation: modal-right-in  0.3s  cubic-bezier(0.22,1,0.36,1)    forwards; }
        .modal-enter-left   { animation: modal-left-in   0.3s  cubic-bezier(0.22,1,0.36,1)    forwards; }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={`fixed inset-0 z-50 flex overflow-y-auto ${positionClasses[position]}`}
      >
        {/* Backdrop */}
        {!isFull && (
          <div
            aria-hidden="true"
            className="modal-backdrop fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeOnBackdrop ? handleClose : undefined}
          />
        )}

        {/* Content */}
        <div
          ref={modalRef}
          className={`${contentClasses} ${positionEnterAnimation[position]} border border-brand-50/10`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — só renderiza se tiver título ou descrição */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-4 pr-14">
              {title && (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Close button */}
          {showCloseButton && (
            <button
              type="button"
              aria-label="Fechar modal"
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 active:scale-95 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-5 sm:top-5 sm:h-10 sm:w-10"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModalV2;