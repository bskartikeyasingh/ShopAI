#!/usr/bin/env bash

# Root files
mkdir -p docs
touch .env.example .gitignore README.md
touch docs/architecture.md docs/api-contracts.md docs/database-schema.md

# Frontend
mkdir -p frontend/src/{api,components/common,components/catalog,components/chat,context,features/seller,features/admin,hooks,pages}
touch frontend/{package.json,vite.config.js,index.html,.env.example}
touch frontend/src/{main.jsx,App.jsx,index.css}
touch frontend/src/api/{apiClient.js,authApi.js,productApi.js,orderApi.js,aiApi.js}
touch frontend/src/components/common/{Navbar.jsx,Footer.jsx,Loader.jsx,ProtectedRoute.jsx}
touch frontend/src/components/catalog/{ProductCard.jsx,FilterSidebar.jsx}
touch frontend/src/components/chat/{ChatWidget.jsx,ChatMessage.jsx}
touch frontend/src/context/{AuthContext.jsx,CartContext.jsx}
touch frontend/src/features/seller/{ProductTable.jsx,AddProductModal.jsx}
touch frontend/src/features/admin/{SellerApprovalTable.jsx,AuditLogView.jsx}
touch frontend/src/hooks/{useAuth.js,useCart.js,useDebounce.js}
touch frontend/src/pages/{Home.jsx,ProductDetails.jsx,Cart.jsx,Checkout.jsx,Login.jsx,Register.jsx,SellerDashboard.jsx,AdminDashboard.jsx,NotFound.jsx}

# Server
mkdir -p server/src/{config,middleware,models,routes,controllers,services,validators,tests}
touch server/{package.json,.env.example}
touch server/src/{app.js,server.js}
touch server/src/config/{db.js,env.js}
touch server/src/middleware/{authMiddleware.js,roleMiddleware.js,errorMiddleware.js,rateLimiter.js}
touch server/src/models/{User.js,Seller.js,Product.js,Cart.js,Order.js,Review.js,AuditEvent.js}
touch server/src/routes/{authRoutes.js,productRoutes.js,cartRoutes.js,orderRoutes.js,sellerRoutes.js,adminRoutes.js,aiRoutes.js}
touch server/src/controllers/{authController.js,productController.js,cartController.js,orderController.js,sellerController.js,adminController.js,aiProxyController.js}
touch server/src/services/{catalogService.js,orderService.js,paymentService.js}
touch server/src/validators/{authValidator.js,productValidator.js,orderValidator.js}
touch server/src/tests/{auth.test.js,order.test.js}

# AI Service
mkdir -p ai-service/app/{api,agents,tools,schemas,services,tests}
touch ai-service/{requirements.txt,.env.example}
touch ai-service/app/{__init__.py,main.py}
touch ai-service/app/api/{__init__.py,chat.py,health.py}
touch ai-service/app/agents/{__init__.py,orchestrator.py,product_agent.py,comparison_agent.py,recommendation_agent.py,seller_agent.py}
touch ai-service/app/tools/{__init__.py,catalog_tool.py,comparison_tool.py,stock_tool.py}
touch ai-service/app/schemas/{__init__.py,chat_schema.py,product_schema.py}
touch ai-service/app/services/{__init__.py,llm_service.py,db_service.py}
touch ai-service/app/tests/{__init__.py,test_agents.py,test_tools.py}

echo "ShopAgent directory structure scaffolded successfully!"
