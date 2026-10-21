# Root & Docs
New-Item -ItemType Directory -Force -Path docs
New-Item -ItemType File -Force -Path .env.example, .gitignore, README.md, docs/architecture.md, docs/api-contracts.md, docs/database-schema.md

# Frontend Directories & Files
$frontendDirs = @(
    "frontend/src/api", "frontend/src/components/common", "frontend/src/components/catalog",
    "frontend/src/components/chat", "frontend/src/context", "frontend/src/features/seller",
    "frontend/src/features/admin", "frontend/src/hooks", "frontend/src/pages"
)
foreach ($dir in $frontendDirs) { New-Item -ItemType Directory -Force -Path $dir }

New-Item -ItemType File -Force -Path frontend/package.json, frontend/vite.config.js, frontend/index.html, frontend/.env.example
New-Item -ItemType File -Force -Path frontend/src/main.jsx, frontend/src/App.jsx, frontend/src/index.css
New-Item -ItemType File -Force -Path frontend/src/api/apiClient.js, frontend/src/api/authApi.js, frontend/src/api/productApi.js, frontend/src/api/orderApi.js, frontend/src/api/aiApi.js
New-Item -ItemType File -Force -Path frontend/src/components/common/Navbar.jsx, frontend/src/components/common/Footer.jsx, frontend/src/components/common/Loader.jsx, frontend/src/components/common/ProtectedRoute.jsx
New-Item -ItemType File -Force -Path frontend/src/components/catalog/ProductCard.jsx, frontend/src/components/catalog/FilterSidebar.jsx
New-Item -ItemType File -Force -Path frontend/src/components/chat/ChatWidget.jsx, frontend/src/components/chat/ChatMessage.jsx
New-Item -ItemType File -Force -Path frontend/src/context/AuthContext.jsx, frontend/src/context/CartContext.jsx
New-Item -ItemType File -Force -Path frontend/src/features/seller/ProductTable.jsx, frontend/src/features/seller/AddProductModal.jsx
New-Item -ItemType File -Force -Path frontend/src/features/admin/SellerApprovalTable.jsx, frontend/src/features/admin/AuditLogView.jsx
New-Item -ItemType File -Force -Path frontend/src/hooks/useAuth.js, frontend/src/hooks/useCart.js, frontend/src/hooks/useDebounce.js
New-Item -ItemType File -Force -Path frontend/src/pages/Home.jsx, frontend/src/pages/ProductDetails.jsx, frontend/src/pages/Cart.jsx, frontend/src/pages/Checkout.jsx, frontend/src/pages/Login.jsx, frontend/src/pages/Register.jsx, frontend/src/pages/SellerDashboard.jsx, frontend/src/pages/AdminDashboard.jsx, frontend/src/pages/NotFound.jsx

# Server Directories & Files
$serverDirs = @(
    "server/src/config", "server/src/middleware", "server/src/models",
    "server/src/routes", "server/src/controllers", "server/src/services",
    "server/src/validators", "server/src/tests"
)
foreach ($dir in $serverDirs) { New-Item -ItemType Directory -Force -Path $dir }

New-Item -ItemType File -Force -Path server/package.json, server/.env.example, server/src/app.js, server/src/server.js
New-Item -ItemType File -Force -Path server/src/config/db.js, server/src/config/env.js
New-Item -ItemType File -Force -Path server/src/middleware/authMiddleware.js, server/src/middleware/roleMiddleware.js, server/src/middleware/errorMiddleware.js, server/src/middleware/rateLimiter.js
New-Item -ItemType File -Force -Path server/src/models/User.js, server/src/models/Seller.js, server/src/models/Product.js, server/src/models/Cart.js, server/src/models/Order.js, server/src/models/Review.js, server/src/models/AuditEvent.js
New-Item -ItemType File -Force -Path server/src/routes/authRoutes.js, server/src/routes/productRoutes.js, server/src/routes/cartRoutes.js, server/src/routes/orderRoutes.js, server/src/routes/sellerRoutes.js, server/src/routes/adminRoutes.js, server/src/routes/aiRoutes.js
New-Item -ItemType File -Force -Path server/src/controllers/authController.js, server/src/controllers/productController.js, server/src/controllers/cartController.js, server/src/controllers/orderController.js, server/src/controllers/sellerController.js, server/src/controllers/adminController.js, server/src/controllers/aiProxyController.js
New-Item -ItemType File -Force -Path server/src/services/catalogService.js, server/src/services/orderService.js, server/src/services/paymentService.js
New-Item -ItemType File -Force -Path server/src/validators/authValidator.js, server/src/validators/productValidator.js, server/src/validators/orderValidator.js
New-Item -ItemType File -Force -Path server/src/tests/auth.test.js, server/src/tests/order.test.js

# AI Service Directories & Files
$aiDirs = @(
    "ai-service/app/api", "ai-service/app/agents", "ai-service/app/tools",
    "ai-service/app/schemas", "ai-service/app/services", "ai-service/app/tests"
)
foreach ($dir in $aiDirs) { New-Item -ItemType Directory -Force -Path $dir }

New-Item -ItemType File -Force -Path ai-service/requirements.txt, ai-service/.env.example, ai-service/app/__init__.py, ai-service/app/main.py
New-Item -ItemType File -Force -Path ai-service/app/api/__init__.py, ai-service/app/api/chat.py, ai-service/app/api/health.py
New-Item -ItemType File -Force -Path ai-service/app/agents/__init__.py, ai-service/app/agents/orchestrator.py, ai-service/app/agents/product_agent.py, ai-service/app/agents/comparison_agent.py, ai-service/app/agents/recommendation_agent.py, ai-service/app/agents/seller_agent.py
New-Item -ItemType File -Force -Path ai-service/app/tools/__init__.py, ai-service/app/tools/catalog_tool.py, ai-service/app/tools/comparison_tool.py, ai-service/app/tools/stock_tool.py
New-Item -ItemType File -Force -Path ai-service/app/schemas/__init__.py, ai-service/app/schemas/chat_schema.py, ai-service/app/schemas/product_schema.py
New-Item -ItemType File -Force -Path ai-service/app/services/__init__.py, ai-service/app/services/llm_service.py, ai-service/app/services/db_service.py
New-Item -ItemType File -Force -Path ai-service/app/tests/__init__.py, ai-service/app/tests/test_agents.py, ai-service/app/tests/test_tools.py

Write-Host "ShopAgent directory structure scaffolded successfully!" -ForegroundColor Green
