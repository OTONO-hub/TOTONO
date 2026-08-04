"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

type MicrosoftClarityProps = {
  projectId: string;
};

export function MicrosoftClarity({
  projectId,
}: MicrosoftClarityProps) {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !projectId
    ) {
      return;
    }

    Clarity.init(projectId);
  }, [projectId]);

  return null;
}
