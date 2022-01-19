import { useMemo, useState } from "react";

export type ModalControl = ReturnType<typeof useModal>

export default function useModal() {
  const [isOpen, setOpen] = useState(false);

  return useMemo(
    () => ({
      isOpen,
      open() {
        !isOpen && setOpen(true);
      },
      close() {
        isOpen && setOpen(false);
      },
    }),
    [isOpen]
  );
}
