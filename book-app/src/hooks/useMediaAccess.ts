"use client";

import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";
import { usePathname } from "next/navigation";

interface GuardedBookInput {
  id: string;
  isPremium: boolean;
}

export function useMediaAccess() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openModal, isSubscribed } = useAuthModal();

  const checkAccessAndNavigate = (book: GuardedBookInput) => {
    if (!book) return;

    if (!user) {
      openModal(pathname);
      return;
    }

    if (book.isPremium && !isSubscribed) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  };

  return { checkAccessAndNavigate };
}