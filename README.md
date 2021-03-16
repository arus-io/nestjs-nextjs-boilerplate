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

### 🚀 Development 

- Download dependencies for both projects running `yarn install`
- Backend:
     - First time you need to create the DDL and insert data using `yarn typeorm migration:run`
     - Run the backend in development mode by using `yarn start:dev:be`
    - Graphql playground available at http://admin.localhost:3001/graphql
- Frontend:
    - Run the frontend in development mode by using `yarn start:dev:fe`
    - Login at http://admin.localhost:3000/login using `admin@mail.com` and `Password1!`
  
### 🚀 Deployment

We use Amazon AWS as our preferred cloud provider, see [Terraform Readme](https://github.com/arus-io/terraform-project-demo) for instructions on how to setup the infrastructure
needed for this demo (kubernetes cluster, dns, postgresql database, etc)

Once the basic infra is created, we use [Github Actions](.github/workflows) scripts to test, build and push the Docker images, and 
[Helm Chart](charts/demo/README.md) to deploy the new kubernetes definitions to Amazon EKS

### ✅ Testing
