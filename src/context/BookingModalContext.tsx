"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface BookingModalContextValue {
  isOpen: boolean;
  openModal: (context?: string) => void;
  closeModal: () => void;
  bookingContext: string;
}

const BookingModalContext = createContext<BookingModalContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  bookingContext: "",
});

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingContext, setBookingContext] = useState("");

  const openModal = useCallback((context = "") => {
    setBookingContext(context);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <BookingModalContext.Provider value={{ isOpen, openModal, closeModal, bookingContext }}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  return useContext(BookingModalContext);
}
