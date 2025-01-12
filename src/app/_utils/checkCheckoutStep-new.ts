import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../_context/SessionContext";
import { createJimmyKey } from "./jimmyKeyUtils";

type CheckStepProps = {
  sessionId: string;
  pageStep: number;
  funnel: string;
};

type CheckStepResponse = {
  valid: boolean;
  message?: string;
  redirectUrl?: string;
};

const useCheckStep = () => {
  const router = useRouter();
  const { sessionId, setSessionId } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkCheckoutStep = useCallback(
    async ({
      pageStep,
      funnel,
    }: Omit<CheckStepProps, "sessionId">): Promise<CheckStepResponse> => {
      if (!sessionId) {
        console.error("No sessionId provided");
        return { valid: false, message: "No session ID provided" };
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/session/check-session-step", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jimmy-key": createJimmyKey().encryptedData,
          },
          body: JSON.stringify({ sessionId, pageStep, funnel }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CheckStepResponse = await response.json();

        if (!data.valid && data.redirectUrl) {
          router.push(data.redirectUrl);
        }

        return data;
      } catch (error) {
        console.error("Error checking session step:", error);
        setError(
          "There was an error processing your request. Please try again."
        );
        return {
          valid: false,
          message:
            "There was an error processing your request. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, router]
  );

  const startNewOrder = useCallback(
    (funnel: string) => {
      setSessionId("");
      localStorage.removeItem("session");
      router.push(`/${funnel}`);
    },
    [setSessionId, router]
  );

  return { checkCheckoutStep, startNewOrder, isLoading, error };
};

export default useCheckStep;
