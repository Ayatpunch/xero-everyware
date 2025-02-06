/**
 * @module SequenceDiagrams
 * @description Visual representation of the main integration flows using Mermaid syntax
 */

/**
 * @typedef {Object} FlowDiagram
 * @property {string} name - Name of the flow
 * @property {string} description - Description of the flow
 */

/**
 * @name Invoice Creation Flow
 * @description Complete flow of invoice creation and payment processing
 * @example
 * ```mermaid
 * sequenceDiagram
 *     participant C as Client
 *     participant A as API Server
 *     participant E as Everyware
 *     participant Cu as Customer
 *     participant X as Xero
 *     
 *     C->>A: POST /invoices/create
 *     A->>A: Validate invoice data
 *     A->>E: Create invoice
 *     E-->>A: Return invoice with payment URL
 *     A-->>C: Return invoice details
 * ```
 */

/**
 * @name Authentication Flow
 * @description OAuth2 authentication process with Xero
 * @example
 * ```mermaid
 * sequenceDiagram
 *     participant C as Client
 *     participant A as API Server
 *     participant X as Xero
 *     
 *     C->>A: GET /auth/xero
 *     A->>X: Request consent URL
 *     X-->>A: Return consent URL
 *     A-->>C: Redirect to Xero login
 *     
 *     C->>X: User authenticates
 *     X->>A: Callback with auth code
 *     A->>X: Exchange code for tokens
 *     X-->>A: Return access/refresh tokens
 * ```
 */

/**
 * @section Error Handling Flow
 * @mermaid
 * sequenceDiagram
 *     participant E as Everyware
 *     participant A as API Server
 *     participant X as Xero
 *     
 *     E->>A: POST /webhooks/payment
 *     
 *     alt Failed Payment
 *         A->>A: Check StatusID !== "0"
 *         A-->>E: 200 OK (No further action)
 *     else Invalid Tenant
 *         A->>A: Check tenant ID
 *         A-->>E: 500 Error
 *     else Xero API Error
 *         A->>X: Create invoice
 *         X-->>A: API Error
 *         A->>A: Log error details
 *         A-->>E: 500 Error
 *     end
 */

/**
 * @section Token Refresh Flow
 * @mermaid
 * sequenceDiagram
 *     participant C as Client
 *     participant A as API Server
 *     participant X as Xero
 *     
 *     C->>A: API Request
 *     A->>A: Check token expiry
 *     
 *     alt Token Expired
 *         A->>X: Request new token
 *         X-->>A: Return new tokens
 *         A->>A: Update stored tokens
 *         A->>X: Retry original request
 *         X-->>A: Response
 *     else Token Valid
 *         A->>X: Original request
 *         X-->>A: Response
 *     end
 *     
 *     A-->>C: API Response
 */

/**
 * @section Data Transformation Flow
 * @mermaid
 * sequenceDiagram
 *     participant E as Everyware
 *     participant A as API Server
 *     participant X as Xero
 *     
 *     E->>A: Webhook with payment data
 *     
 *     A->>A: Transform payment data
 *     Note over A: Format dates
 *     Note over A: Parse amounts
 *     Note over A: Format customer info
 *     
 *     A->>X: Create invoice request
 *     X-->>A: Invoice created
 *     
 *     A->>A: Transform payment details
 *     A->>X: Create payment request
 *     X-->>A: Payment created
 */

/**
 * @section Refund Flow
 * @mermaid
 * sequenceDiagram
 *     participant E as Everyware
 *     participant A as API Server
 *     participant X as Xero
 *     
 *     E->>A: Refund webhook
 *     A->>X: Find original invoice
 *     X-->>A: Invoice details
 *     
 *     A->>X: Create credit note
 *     X-->>A: Credit note created
 *     
 *     A->>X: Apply refund payment
 *     X-->>A: Refund applied
 *     
 *     A-->>E: 200 OK
 */