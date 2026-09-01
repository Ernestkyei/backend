CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email_id UUID NOT NULL,

    event VARCHAR(100) NOT NULL,

    details JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_email
        FOREIGN KEY (email_id)
        REFERENCES emails(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_email_id
ON audit_logs(email_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event
ON audit_logs(event);