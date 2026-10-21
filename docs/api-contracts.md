# ShopAgent: API Contracts

## Authentication
- `POST /api/auth/register`: `{ name, email, password, role, storeName?, storeDescription? }`
- `POST /api/auth/login`: `{ email, password }` -> `{ token, user }`

## Product Catalog
- `GET /api/products`: Query params: `search`, `category`, `minPrice`, `maxPrice`, `page`, `limit`
- `GET /api/products/:id`: Returns product document populated with seller details.

## Seller Operations (Role: seller)
- `GET /api/seller/products`: Returns list of products owned by seller.
- `POST /api/seller/products`: Creates product listing (requires status = approved).
- `PUT /api/seller/products/:id`: Updates product listing.
- `GET /api/seller/orders`: Returns vendor-specific sub-orders.

## Orders & Checkout
- `POST /api/orders/checkout`: Atomic multi-vendor checkout decrementing stock and partitioning escrow sub-orders.
- `GET /api/orders/my-orders`: Returns customer order history.

## Admin Operations (Role: admin)
- `GET /api/admin/sellers`: Lists all vendor accounts.
- `PUT /api/admin/sellers/:id/status`: Updates vendor approval (`approved`, `rejected`, `suspended`).
- `GET /api/admin/audit-logs`: Immutable platform compliance log.

## AI Service (Internal API via Express Gateway)
- `POST /api/ai/chat`: `{ message: string, sellerContext?: object }`
