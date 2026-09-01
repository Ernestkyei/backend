CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email_id UUID NOT NULL,

    body TEXT NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',

    sent_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_response_email
        FOREIGN KEY (email_id)
        REFERENCES emails(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_responses_email_id
ON responses(email_id);