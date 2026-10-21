# ShopAgent: Database Schema (MongoDB Mongoose)

## Collections

### 1. `users`
- `name` (String, required)
- `email` (String, required, unique, indexed)
- `passwordHash` (String, required)
- `role` ('customer' | 'seller' | 'admin', default 'customer', indexed)
- Timestamps (`createdAt`, `updatedAt`)

### 2. `sellers`
- `userId` (ObjectId -> User, unique, indexed)
- `storeName` (String, required)
- `description` (String)
- `status` ('pending' | 'approved' | 'rejected' | 'suspended', default 'pending', indexed)
- `commissionRate` (Number, default 0.10)
- `rating` (Number, default 5.0)
- `totalSales` (Number, default 0)
- Timestamps

### 3. `products`
- `sellerId` (ObjectId -> Seller, required, indexed)
- `name` (String, text indexed)
- `description` (String, text indexed)
- `category` (String, indexed)
- `price` (Number, min 0)
- `stock` (Number, min 0)
- `imageUrl` (String)
- `attributes` (Map of String)
- `active` (Boolean, default true, indexed)
- Timestamps

### 4. `orders`
- `customerId` (ObjectId -> User, required, indexed)
- `shippingAddress` (street, city, state, zipCode, country)
- `totalAmount` (Number)
- `paymentStatus` ('pending' | 'paid' | 'failed')
- `subOrders` (Array):
  - `sellerId` (ObjectId -> Seller, indexed)
  - `items` (Array of line items: productId, sellerId, nameSnapshot, unitPrice, quantity, itemTotal)
  - `subtotal` (Number)
  - `platformFee` (Number)
  - `sellerPayout` (Number)
  - `fulfillmentStatus` ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')
- Timestamps

### 5. `audit_events`
- `actorId` (ObjectId -> User)
- `action` (String, indexed)
- `targetType` (String)
- `targetId` (ObjectId)
- `metadata` (Object)
- `createdAt` (Timestamp)
