project-root/
├── package.json
├── tsconfig.json
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── client-party.js
├── src/
│   ├── config/
│   │   ├── constants.ts
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── userController.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── uploadMiddleware.ts
│   ├── models/
│   │   └── User.ts
│   ├── party/
│   │   ├── globe.ts
│   │   └── shared.ts
│   ├── routes/
│   │   ├── apiRoutes.ts
│   │   └── viewRoutes.ts
│   ├── services/
│   │   └── r2Service.ts
│   └── server.ts
└── views/
    ├── partials/
    │   ├── head.ejs
    │   └── navbar.ejs
    ├── login.ejs
    ├── register.ejs
    ├── dashboard.ejs
    └── profile.ejs