# NestJS + NextJs project template

This boilerplate is made to quickly prototype frontend + backend applications.
Main techonologies:
* [NestJS](https://nestjs.com/)
* [NextJS](https://nextjs.org)

---

### 🛠️ Prerequisites


- Please make sure to have an accessible SQL database instance (Postgresql recommended) and a Redis instance to store cache and sessions. 
  Both can be installed locally running 
  ```
  docker-compose up -d
  ```
- `Subdomains` are used to separate `admin` and `user` parts of the application, as well for **Whitelabeling**.
Edit your `/etc/hosts` file and add an entry to enable access to `admin.localhost` 
  ```
  127.0.0.1 admin.localhost
  ```

- All environment variables are read using [dotenv](https://www.npmjs.com/package/dotenv). You will need to create `.env` file in project root. Example data for this file can be found in `.env.sample` already located inside root of the project or using the following info:

    ```sh
    cp .env.sample .env
    ```
---

### 🚀 Running 

- Download dependencies for both projects running `yarn`
- Backend:
    - Run the backend in development mode by using `yarn start:dev:be`
    - First time you need to create the DDL and insert data using `yarn typeorm migration:run`  
    - Graphql playground available at http://admin.localhost:3001/graphql
- Frontend:
    - Run the frontend in development mode by using `yarn start:dev:fe`
    - Login at http://admin.localhost:3000/login
    

### ✅ Testing
