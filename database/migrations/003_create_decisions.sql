CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email_id UUID NOT NULL,

    decision VARCHAR(50) NOT NULL,

    reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_decision_email
        FOREIGN KEY (email_id)
        REFERENCES emails(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_decisions_email_id
ON decisions(email_id);