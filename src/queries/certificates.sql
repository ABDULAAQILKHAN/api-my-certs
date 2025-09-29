
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date TIMESTAMPTZ NULL,
    expiry_date TIMESTAMPTZ NULL,
    credential_id VARCHAR(255) NULL,
    is_public BOOLEAN NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 🔹 Indexes for performance
-- 1. Speed up lookups by user
CREATE INDEX idx_certificates_user_id ON certificates (user_id);

-- 2. Support searching/filtering by issuer
CREATE INDEX idx_certificates_issuer ON certificates (issuer);

-- 3. Optimize queries on issue_date and expiry_date (range queries)
CREATE INDEX idx_certificates_issue_date ON certificates (issue_date);
CREATE INDEX idx_certificates_expiry_date ON certificates (expiry_date);

-- 4. Faster lookups on credential_id if used in validation/verification
CREATE UNIQUE INDEX idx_certificates_credential_id ON certificates (credential_id);

-- 5. Allow quick filtering on public vs private certs
CREATE INDEX idx_certificates_is_public ON certificates (is_public);

-- 6. Keep timestamps query-friendly
CREATE INDEX idx_certificates_created_at ON certificates (created_at);
