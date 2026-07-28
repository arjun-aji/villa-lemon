"use client";

import React from "react";
import { useBookingModal } from "@/context/BookingModalContext";

interface BookingButtonProps {
  children: React.ReactNode;
  className?: string;
  context?: string;
  id?: string;
  onClick?: () => void;
}

/** Drop-in replacement for any "Book Your Stay" anchor/button.
 *  Opens the global BookingModal with the enquiry form.
 */
export default function BookingButton({ children, className, context, id, onClick }: BookingButtonProps) {
  const { openModal } = useBookingModal();

  const handleClick = () => {
    openModal(context);
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
