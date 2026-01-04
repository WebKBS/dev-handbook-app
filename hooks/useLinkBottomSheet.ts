import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";

export function useLinkBottomSheet() {
  const ref = useRef<BottomSheetModal>(null);
  const [url, setUrl] = useState<string | null>(null);

  const open = useCallback((nextUrl: string) => {
    setUrl(nextUrl);
    ref.current?.present();
  }, []);

  const close = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return { ref, url, open, close };
}
