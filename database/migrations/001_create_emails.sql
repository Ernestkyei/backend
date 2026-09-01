CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    message_id VARCHAR(255) UNIQUE NOT NULL,

    sender_email VARCHAR(320) NOT NULL,
    sender_name VARCHAR(255),

    subject TEXT,
    body TEXT NOT NULL,

    received_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emails_sender_email
ON emails(sender_email);

CREATE INDEX IF NOT EXISTS idx_emails_received_at
ON emails(received_at);