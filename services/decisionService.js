export const decideEmailAction = ({
  classification,
  confidence
}) => {
  if (classification === "IN_REMIT" && confidence >= 0.85) {
    return {
      decision: "AUTOMATE",
      reason: "The email is within remit and has sufficient confidence."
    };
  }

  if (classification === "OUT_OF_REMIT") {
    return {
      decision: "NO_ACTION",
      reason: "The email is outside the organization's remit."
    };
  }

  if (classification === "NEEDS_REVIEW") {
    return {
      decision: "ESCALATE",
      reason: "The email requires human review."
    };
  }

  return {
    decision: "ESCALATE",
    reason: "The classification or confidence could not be safely handled."
  };
};