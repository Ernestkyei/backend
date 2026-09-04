import { getAuditLogs } from "../services/auditService.js";

export const getAudits = async (req, res) => {
  try {
    const auditLogs = await getAuditLogs();

    const totalEvents = auditLogs.length;

    const aiDecisions = auditLogs.filter(
      (log) =>
        log.event === "EMAIL_CLASSIFIED" ||
        log.event === "DECISION_MADE"
    ).length;

    const responsesSent = auditLogs.filter(
      (log) => log.event === "RESPONSE_GENERATED"
    ).length;

    const reviewCases = auditLogs.filter(
      (log) => log.event === "HUMAN_REVIEW_REQUIRED"
    ).length;

    res.status(200).json({
      success: true,

      summary: {
        total_events: totalEvents,
        ai_decisions: aiDecisions,
        responses_sent: responsesSent,
        review_cases: reviewCases
      },

      auditLogs
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs"
    });
  }
};