# ShouldIBuyThis.io — Setup Guide

## Prerequisites

- [Node.js 18+](https://nodejs.org) installed
- An AWS account

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Create the DynamoDB table

In the AWS Console (or via CLI):

**Table name:** `shouldibuythis-waitlist`
**Partition key:** `email` (String)
**Billing:** On-demand (pay-per-request)

Via CLI:
```bash
aws dynamodb create-table \
  --table-name shouldibuythis-waitlist \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:
- For local dev: use IAM user credentials with DynamoDB write access
- For AWS deployment: attach an IAM role to your compute (no keys needed)

---

## 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 5. Deploy to AWS

### Option A — AWS Amplify (recommended, easiest)
1. Push the repo to GitHub
2. Connect in the Amplify Console → "Host a web app"
3. Add your environment variables in Amplify → App settings → Environment variables
4. Attach an IAM role to the Amplify app with `dynamodb:PutItem` permission on your table

### Option B — S3 + CloudFront (static export)
Add `output: 'export'` to `next.config.ts`, then `npm run build`.
Note: the `/api/waitlist` route won't work with static export — you'd need a separate Lambda.

---

## IAM policy for the DynamoDB table

Minimum required permissions:
```json
{
  "Effect": "Allow",
  "Action": ["dynamodb:PutItem", "dynamodb:Scan"],
  "Resource": "arn:aws:dynamodb:us-east-1:*:table/shouldibuythis-waitlist"
}
```

---

## 6. Set up AWS SES (confirmation emails)

The API sends a confirmation email to each signup via AWS Simple Email Service (SES).

### Step 1 — Verify your sender address

SES requires you to verify the `From` address before sending. By default this is `hello@shouldibuythis.io`.

```bash
aws ses verify-email-identity \
  --email-address hello@shouldibuythis.io \
  --region us-east-1
```

Check your inbox and click the verification link AWS sends you.

### Step 2 — Request production access (exit sandbox)

New SES accounts start in sandbox mode and can only send to verified addresses.
To send to real waitlist signups, request production access:

1. Open the SES Console → Account dashboard → "Request production access"
2. Use case: Transactional email
3. Describe: sending waitlist confirmation emails for a SaaS product

AWS typically approves within 24 hours.

### Step 3 — Add the env variable

In `.env.local` (local dev) and in your hosting platform's environment config:

```
WAITLIST_FROM_EMAIL=hello@shouldibuythis.io
```

### SES IAM permission to add to your policy

```json
{
  "Effect": "Allow",
  "Action": ["ses:SendEmail"],
  "Resource": "*"
}
```

Or scope it to a specific SES identity:
```json
{
  "Effect": "Allow",
  "Action": ["ses:SendEmail"],
  "Resource": "arn:aws:ses:us-east-1:YOUR_ACCOUNT_ID:identity/hello@shouldibuythis.io"
}
```
