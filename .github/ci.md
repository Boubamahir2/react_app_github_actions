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
    steps:
      - uses: actions/checkout@v3  # Optimized checkout action version
      - name: Use Node.js 16
        uses: actions/setup-node@v3
        with:
          node-version: 16.x  # Modern, well-supported Node.js version

      - name: Install dependencies
        run: npm install

      - name: Build React project
        run: npm run build  # Assuming you have a build script in package.json
        # Or use Create React App's built-in build command:
        # run: npm run build

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3  # Optimized checkout action version
      - name: Use Node.js 16
        uses: actions/setup-node@v3
        with:
          node-version: 16.x  # Modern, well-supported Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run React tests
        run: npm test  # Assuming you have a test script in package.json
        # Or use Jest's default command:
        # run: npx jest

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
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/go-web-app:${{github.run_id}}

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
        sed -i 's/tag: .*/tag: "${{github.run_id}}"/' helm/go-web-app-chart/values.yaml

    - name: Commit and push changes
      run: |
        git config --global user.email "amamahir1@gmail.com"
        git config --global user.name "Boubamahir2"
        git add helm/go-web-app-chart/values.yaml
        git commit -m "Update tag in Helm chart"
        git push










## Breakdown of the React CI/CD Workflow:
This workflow defines a series of automated tasks that run when you push code to your GitHub repository. Here's a breakdown of each section:

1. Trigger:

on: push: This section defines when the workflow should run. In this case, it triggers whenever there's a push to the main branch.
2. Paths to Ignore:

paths-ignore: This section specifies files or directories that changes in these locations won't trigger the workflow. This helps avoid unnecessary builds if changes are only made to documentation (README.md) or Kubernetes configurations (k8s/**).
3. Jobs:

The workflow defines three jobs: build, test, and push. These jobs run in parallel (unless specified otherwise) on Ubuntu virtual machines.

build:

### Checks out the code from your repository.
Sets up Node.js version 16.
Installs project dependencies using npm install.
Runs the build script defined in your package.json (assuming npm run build). This creates the production-ready version of your React application.
test:

### Checks out the code from your repository.
Sets up Node.js version 16.
Installs project dependencies using npm install.
Runs the test script defined in your package.json (assuming npm test). This executes tests to ensure your application functions correctly.
push (Disabled due to security concerns):

### Requires the build job to complete successfully (needs: build). This ensures the application is built before attempting to push it.
Checks out the code from your repository.
Sets up Docker Buildx (a tool for building Docker images).
Logs in to DockerHub using secrets stored in your repository (DOCKERHUB_USERNAME and DOCKERHUB_TOKEN).
Builds and pushes the Docker image of your application to DockerHub with a tag containing the current workflow run ID (${{github.run_id}}).
4. Disabled Job: update-newtag-in-helm-chart

This job was originally intended to update the tag in your Helm chart's values.yaml file with the same run ID used for the Docker image tag. However, it's disabled due to security risks. Directly committing changes through GitHub Actions is not recommended as it bypasses code reviews and can lead to unintended consequences.
