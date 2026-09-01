CREATE TABLE IF NOT EXISTS review_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email_id UUID NOT NULL,

    assigned_to VARCHAR(255),

    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',

    reason TEXT,

    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_email
        FOREIGN KEY (email_id)
        REFERENCES emails(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_review_cases_email_id
ON review_cases(email_id);

CREATE INDEX IF NOT EXISTS idx_review_cases_status
ON review_cases(status);