module.exports = {
  apps : [
    {
      name: "vn-backend",
      script: "npm run build;",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT:3333,
        APP_KEY:"oAXohJmp8-ebwrm8HJE-z25myhSqqNma",
        DB_CONNECTION:"sqlite"
      }
    }
  ]
}
