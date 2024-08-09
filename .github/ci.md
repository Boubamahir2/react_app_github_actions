
## Continuous Integration (CI)
Continuous Integration (CI) is the practice of automating the integration of code changes into a shared repository. CI helps to catch bugs early in the development process and ensures that the code is always in a deployable state.

We will use GitHub Actions to implement CI for the Go web application. GitHub Actions is a feature of GitHub that allows you to automate workflows, such as building, testing, and deploying code.

The GitHub Actions workflow will run the following steps:
- Checkout the code from the repository
- Build the Docker image
- Run the Docker container
- Run tests

### steps in setting github actions
- create a folder .github/workfows
- create a file ci.yaml
- go to github , then settings 
- got actions , then got secrets and variables 
- create github TOKEN for secret.TOKEN
- create DOCKERHUB_USERNAME and DOCKERHUB_TOKEN variables
- got to docker hub , then Account settings-> click personal access token and generate new token, copy and paste it into DOCKERHUB_TOKEN field  
- you can visit github market place for pipeline syntanx

## paste the following code to your ci.yaml file in .github/workfows
```
name: React CI/CD

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'helm/**'
      - 'k8s/**'
      - 'README.md'

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30 
    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
      - uses: actions/checkout@v3  # Optimized checkout action version
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }} # Modern, well-supported Node.js version
      #  caching step just before the npm install
      - name: Cache Node.js modules
        uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run: npm install

      - name: Run ESLint for code analysis
        run: npx eslint . 
        #npx eslint . --fix 
        #Automatically fixes issues like missing semicolons, spacing, and formatting that can be corrected automatically based on your ESLint configuration.


      - name: Build React project
        run: npm run build  # Assuming you have a build script in package.json
        # Or use Create React App's built-in build command:
        # run: npm run build


  push:
    runs-on: ubuntu-latest

    needs: build

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1

    - name: Login to DockerHub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and Push action
      uses: docker/build-push-action@v6
      with:
        context: .
        file: ./Dockerfile
        push: true
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/react-app-github-actions:${{github.run_id}}

  update-newtag-in-helm-chart:
    runs-on: ubuntu-latest

    needs: push

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      with:
        token: ${{ secrets.TOKEN }}

    - name: Update tag in Helm chart
      run: |
        sed -i 's/tag: .*/tag: "${{github.run_id}}"/' helm/react-app-chart/values.yaml

    - name: Commit and push changes
      run: |
        git config --global user.email "amamahir1@gmail.com"
        git config --global user.name "Boubamahir2"
        git add helm/react-app-chart/values.yaml
        git commit -m "Update tag in Helm chart"
        git push


```



## Breakdown of the React CI/CD Workflow:
This workflow defines a multi-stage pipeline for building, testing, and deploying a React application. Here's a breakdown of each section:

1. Name:
`name: React CI/CD:` This describes the overall purpose of the workflow.

2. Trigger (on):

`on: push:` The workflow runs whenever there's a push to the repository.
`branches: main:` It specifically runs for pushes to the `main` branch.
`paths-ignore:` This excludes specific files and folders from triggering the workflow, such as Helm chart files, Kubernetes configurations, and the README file. This ensures the workflow focuses on code changes relevant to the React application.
3. Jobs:

### build: This job handles building the React application.

`runs-on: ubuntu-latest:` Specifies that this job runs on a virtual machine with the latest Ubuntu operating system.
`timeout-minutes: 30:` Sets a 30-minute timeout limit for the job.
`strategy: matrix:` Defines a matrix for testing with different Node.js versions.
`node-version: [16.x, 18.x]:` This tests the build with both Node.js 16.x and 18.x versions.
`steps:` These are the individual actions performed within the job:
`uses: actions/checkout@v3:` Checks out the code from the repository.
`uses: actions/setup-node@v3:` Sets up the specified Node.js version (node-version) in the job runner environment.
`uses: actions/cache@v3:` Caches the node_modules directory based on the operating system, Node.js version, and the hash of the package-lock.json file. This optimizes build times by reusing previously downloaded dependencies.
`run: npm install:` Installs all dependencies listed in the package.json file.
`run: npx eslint .:` Runs ESLint for code analysis.
(Commented out) # npx eslint . --fix: Optionally, this would automatically fix correctable code style issues.
`run: npm run build:` Builds the React application (assuming a build script in package.json). Alternatively, it could use Create React App's built-in build command (npm run build).
`push:` This job deploys the built application to DockerHub.

`runs-on:` ubuntu-latest: Similar to the build job.
`needs: build:` Specifies that this job waits for the build job to complete successfully before proceeding.
`steps:` Actions performed within this job:
`uses: actions/checkout@v4:` Checks out the code from the repository.
`uses: docker/setup-buildx-action@v1:` Sets up Docker Buildx for building container images efficiently.
`uses: docker/login-action@v3:` Logs in to DockerHub using secrets stored in the repository (DOCKERHUB_USERNAME and DOCKERHUB_TOKEN).
`uses: docker/build-push-action@v6:` Builds and pushes the container image to DockerHub.
`context: .:` Uses the current directory as the build context.
`file:` ./Dockerfile: Specifies the Dockerfile used for building the image.
`push: true:` Enables pushing the image to DockerHub.
`tags: ${{ secrets.DOCKERHUB_USERNAME }}/react-app-github-actions:${{github.run_id}}: `Defines the image tag. It includes the username, the application name, and the unique workflow run ID.
update-newtag-in-helm-chart: This job updates the Helm chart with the new Docker image tag.

`runs-on: ubuntu-latest:` Similar to previous jobs.
`needs: push:` This job also requires the successful completion of the push job.
`steps: Actions performed within this job:`
`uses: actions/checkout@v4:` Checks out the code from the repository, using a separate access token (TOKEN).
`run: |: Defines a multi-line shell script:`
sed -i 's/tag: .*/tag: "${{github.run_id}}"/' helm/react-app-chart/values.yaml: Uses the sed command to replace the existing tag value in
